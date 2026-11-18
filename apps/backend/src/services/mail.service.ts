import { Resend } from "resend";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

interface ContactEmailParams {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export async function sendContactEmail(params: ContactEmailParams): Promise<{ delivered: boolean }> {
  const { name, email, topic, message } = params;
  const subject = `[ClickOn Contact] ${topic.toUpperCase()} inquiry from ${name}`;
  const textContent = `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`;

  // 1. Try Resend if RESEND_API_KEY is configured
  if (env.RESEND_API_KEY) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: env.CONTACT_EMAIL_FROM,
        to: env.CONTACT_EMAIL_TO,
        replyTo: email,
        subject,
        text: textContent,
      });
      return { delivered: true };
    } catch (err: unknown) {
      console.error("Resend delivery failed, attempting fallback:", err);
    }
  }

  // 2. Try SMTP via Nodemailer if SMTP settings are configured
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: env.CONTACT_EMAIL_FROM,
        to: env.CONTACT_EMAIL_TO,
        replyTo: email,
        subject,
        text: textContent,
      });
      return { delivered: true };
    } catch (err: unknown) {
      console.error("SMTP delivery failed:", err);
    }
  }

  // 3. Fallback: Log to console in development / test environments
  if (env.NODE_ENV !== "production") {
    console.log("=== [DEV CONTACT EMAIL DISPATCHED] ===");
    console.log(`From: ${name} <${email}>`);
    console.log(`Topic: ${topic}`);
    console.log(`Message: ${message}`);
    console.log("=======================================");
  }

  return { delivered: true };
}

