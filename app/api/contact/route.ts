
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Read submitted form data
    const body = await request.json();

    const { name, email, subject, message } = body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Please fill in all fields." },
        { status: 400 }
      );
    }

    // Validate input lengths and email format
    if (
      name.length > 100 ||
      email.length > 254 ||
      subject.length > 200 ||
      message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { success: false, error: "Please check your form details." },
        { status: 400 }
      );
    }

    // Read Titan SMTP configuration from environment variables
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const recipient = process.env.CONTACT_TO;

    if (!host || !user || !pass || !recipient) {
      console.error("JEC contact email configuration is incomplete.");

      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    if (![465, 587].includes(port)) {
      return NextResponse.json(
        { success: false, error: "Invalid email server configuration." },
        { status: 500 }
      );
    }

    // Connect to Titan Email SMTP
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    // Send the contact form message
    const info = await transporter.sendMail({
      from: `"Jaipur Esports Club Website" <${user}>`,
      to: recipient,
      replyTo: email.trim(),
      subject: `[JEC Contact Form] ${subject.trim()}`,
      text: [
        "New message received through the JEC website.",
        "",
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Subject: ${subject.trim()}`,
        "",
        "Message:",
        message.trim(),
      ].join("\n"),
    });

    console.log("JEC contact email accepted by SMTP:", info.messageId);

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("JEC contact email failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "We could not send your message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
