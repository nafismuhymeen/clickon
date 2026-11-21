import { Resend } from "resend";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

interface ContactEmailParams {
  name: string;
  email: string;
  topic: string;
  message: string;
}

interface CSVEmailParams {
  to: string;
  linkId: number;
  linkSlug: string;
  totalClicks: number;
  csvContent: string;
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

export async function sendVerificationEmail(params: {
  to: string;
  verificationUrl: string;
}): Promise<void> {
  const { to, verificationUrl } = params;
  const subject = "[ClickOn] Verify Your Email Address";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-bottom: 16px;">Welcome to ClickOn!</h2>
      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        Thanks for signing up. Please click the button below to verify your email address and activate your account.
      </p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="${verificationUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
        Or copy and paste this link into your browser: <br />
        <a href="${verificationUrl}" style="color: #4f46e5; word-break: break-all;">${verificationUrl}</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 12px;">
        This verification link will expire in 24 hours. If you did not create this account, you can safely ignore this email.
      </p>
    </div>
  `;

  // 1. Try Resend if configured
  if (env.RESEND_API_KEY) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: env.CONTACT_EMAIL_FROM,
        to: to,
        subject,
        html,
      });
      return;
    } catch (err: unknown) {
      console.error("Resend verification email failed:", err);
    }
  }

  // 2. Try SMTP via Nodemailer
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
        to,
        subject,
        html,
      });
      return;
    } catch (err: unknown) {
      console.error("SMTP verification email failed:", err);
    }
  }

  // 3. Fallback: Log to console in dev/test
  if (env.NODE_ENV !== "production") {
    console.log("=== [DEV VERIFICATION EMAIL DISPATCHED] ===");
    console.log(`To: ${to}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log("==========================================");
  }
}

export async function sendCSVEmail(params: CSVEmailParams): Promise<void> {
  const { to, linkId, linkSlug, totalClicks, csvContent } = params;

  // For Resend, we need to send as an attachment
  // Resend attachments are Base64 encoded
  const base64CSV = Buffer.from(csvContent).toString("base64");
  const csvFileName = `clickon-export-${linkId}.csv`;

  const subject = `[ClickOn] Your CSV Report - ${linkSlug}`;

  // 1. Try Resend if RESEND_API_KEY is configured
  if (env.RESEND_API_KEY) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: env.CONTACT_EMAIL_FROM,
        to: to,
        subject,
        html: `
          <h2 style="color: #4f46e5;">Your CSV Export is Ready!</h2>
          <p>Your click analytics report for <strong>link: ${linkSlug}</strong> is ready.</p>
          <p><strong>Total Clicks:</strong> ${totalClicks}</p>
          <p>The CSV file has been attached to this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Sent via ClickOn</p>
        `,
        attachments: [
          {
            content: base64CSV,
            filename: csvFileName,
            contentType: "text/csv",
          },
        ],
      });
      return;
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
        to: to,
        subject,
        html: `
          <h2 style="color: #4f46e5;">Your CSV Export is Ready!</h2>
          <p>Your click analytics report for <strong>link: ${linkSlug}</strong> is ready.</p>
          <p><strong>Total Clicks:</strong> ${totalClicks}</p>
          <p>The CSV file has been attached to this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Sent via ClickOn</p>
        `,
        attachments: [
          {
            filename: csvFileName,
            path: undefined,
            contentType: "text/csv",
            // Nodemailer accepts buffer or string content
            content: csvContent,
          },
        ],
      });
      return;
    } catch (err: unknown) {
      console.error("SMTP delivery failed:", err);
    }
  }

  // 3. Fallback: Log to console in development / test environments
  if (env.NODE_ENV !== "production") {
    console.log("=== [DEV CSV EMAIL DISPATCHED] ===");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Link: ${linkSlug} (${totalClicks} clicks)`);
    console.log(`CSV Content (first 500 chars): ${csvContent.substring(0, 500)}`);
    console.log("======================================");
  }
}

