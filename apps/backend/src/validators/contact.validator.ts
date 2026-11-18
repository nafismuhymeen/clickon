import { z } from "zod";
import { CONTACT_TOPICS } from "../config/limits.js";

export const contactSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email format")
    .transform((e) => e.toLowerCase()),
  topic: z.enum(CONTACT_TOPICS, {
    errorMap: () => ({ message: "Please select a valid topic" }),
  }),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message cannot exceed 5000 characters"),
  // Honeypot field (hidden in UI) - must be empty
  honeypot: z.string().optional(),
  botField: z.string().optional(),
});

