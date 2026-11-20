import { io, Socket } from 'socket.io-client';
import { getStoredAccessToken } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  const token = getStoredAccessToken();

  if (!socketInstance || !socketInstance.connected) {
    socketInstance = io(API_BASE_URL, {
      auth: { token: token || '' },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      withCredentials: true,
    });
  } else if (token && socketInstance.auth) {
    (socketInstance.auth as { token: string }).token = token;
  }

  return socketInstance;
}
