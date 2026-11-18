import type { Request, Response } from "express";
import { contactSchema } from "../validators/contact.validator.js";
import { sendContactEmail } from "../services/mail.service.js";
import { sendSuccess } from "../utils/response.js";

export class ContactController {
  static async submit(req: Request, res: Response): Promise<Response> {
    const parsed = contactSchema.parse(req.body);

    // Spam / Honeypot check: if honeypot or botField is filled, silently discard
    if (parsed.honeypot || parsed.botField) {
      return sendSuccess(
        res,
        { message: "Your message has been dispatched to our engineering team!" },
        200
      );
    }

    await sendContactEmail({
      name: parsed.name,
      email: parsed.email,
      topic: parsed.topic,
      message: parsed.message,
    });

    return sendSuccess(
      res,
      { message: "Your message has been dispatched to our engineering team!" },
      200
    );
  }
}

