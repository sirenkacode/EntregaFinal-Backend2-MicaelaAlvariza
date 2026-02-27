import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from '../config/config.js';

export const createTransporter = () => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // Fail fast with a clear error; teacher will check env usage
    throw new Error('SMTP is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally SMTP_PORT, SMTP_FROM) in .env');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendMail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  return transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    html,
  });
};
