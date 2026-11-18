import { Server as SocketIOServer, type Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import { env } from "../config/env.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { SOCKET_EVENT_CLICK_NEW } from "../config/limits.js";
import { db } from "../db/index.js";
import { links } from "../db/schema/index.js";
import { eq, and } from "drizzle-orm";
import type { ClickNewEvent, User } from "../types/index.js";

let ioInstance: SocketIOServer | null = null;

export function initSocketIO(server: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // Handshake authentication with access JWT
  io.use((socket: Socket, next) => {
    try {
      const authHeader =
        (socket.handshake.auth?.token as string | undefined) ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");

      if (!authHeader) {
        return next(new Error("Authentication token required"));
      }

      const user = verifyAccessToken(authHeader);
      socket.data = { user };
      next();
    } catch {
      next(new Error("Invalid or expired authentication token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as User;

    // Join room for a specific link: verifies ownership before allowing join
    socket.on("join", async (data: { linkId: number }) => {
      try {
        const linkId = Number(data?.linkId);
        if (!linkId || isNaN(linkId)) return;

        // Verify link belongs to authenticated user
        const [link] = await db
          .select({ id: links.id })
          .from(links)
          .where(and(eq(links.id, linkId), eq(links.userId, user.id)))
          .limit(1);

        if (link) {
          socket.join(`link:${linkId}`);
        }
      } catch (err) {
        console.error("Socket join error:", err);
      }
    });

    socket.on("leave", (data: { linkId: number }) => {
      const linkId = Number(data?.linkId);
      if (linkId) {
        socket.leave(`link:${linkId}`);
      }
    });
  });

  ioInstance = io;
  return io;
}

export function emitClickEvent(event: ClickNewEvent): void {
  if (!ioInstance) return;
  const room = `link:${event.linkId}`;
  // Emit 'click:new' to the link room
  ioInstance.to(room).emit(SOCKET_EVENT_CLICK_NEW, event);
  // Also emit 'click' as fallback event
  ioInstance.to(room).emit("click", event);
}
