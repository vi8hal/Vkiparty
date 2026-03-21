// ============================================================
// src/lib/mailer.ts
//
// Nodemailer-based email service.
// Sends OTPs with beautiful HTML templates matching the
// Manki Party brand (yellow/orange/dark theme).
// ============================================================

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_SERVER_HOST,
  port:   Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// ─── TEMPLATES ───────────────────────────────────────────────

function otpTemplate(otp: string, purpose: string, expiryMins: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manki Party — Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#111118,#1a1a28);border:1px solid rgba(255,165,0,0.25);border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#FFD700,#FF6B00);padding:4px 0;"></td>
          </tr>
          <tr>
            <td style="padding:36px 40px 24px;text-align:center;">
              <div style="display:inline-block;background:linear-gradient(135deg,#FFD700,#FF6B00);border-radius:14px;padding:12px 24px;margin-bottom:24px;">
                <span style="font-size:22px;font-weight:900;color:#0A0A0F;letter-spacing:2px;">🇮🇳 MANKI PARTY</span>
              </div>
              <h1 style="color:#F5F5F0;font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:1px;">${purpose}</h1>
              <p style="color:#9090A0;font-size:15px;margin:0;">Your one-time verification code</p>
            </td>
          </tr>
          <!-- OTP Box -->
          <tr>
            <td style="padding:8px 40px 32px;text-align:center;">
              <div style="background:rgba(255,215,0,0.07);border:2px solid rgba(255,107,0,0.4);border-radius:14px;padding:28px 20px;display:inline-block;margin:0 auto;">
                <div style="font-size:48px;font-weight:900;letter-spacing:16px;color:#FFD700;font-family:'Courier New',monospace;">${otp}</div>
              </div>
              <p style="color:#FF6B00;font-size:13px;font-weight:600;margin:16px 0 0;letter-spacing:1px;">
                ⏱ EXPIRES IN ${expiryMins} MINUTES
              </p>
            </td>
          </tr>
          <!-- Warning -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:14px 18px;">
                <p style="color:#FCA5A5;font-size:13px;margin:0;line-height:1.6;">
                  🔒 <strong>Never share this code</strong> with anyone — Manki Party officials will never ask for your OTP. If you did not request this, please ignore this email.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="color:#555565;font-size:12px;margin:0;">© ${new Date().getFullYear()} Manki Party · Grassroots Connect</p>
              <p style="color:#555565;font-size:11px;margin:6px 0 0;">Jai Hind 🇮🇳</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── SEND FUNCTIONS ──────────────────────────────────────────

export async function sendRegistrationOtp(email: string, otp: string) {
  await transporter.sendMail({
    from:    `"Manki Party" <${process.env.EMAIL_FROM}>`,
    to:      email,
    subject: `${otp} — Your Manki Party Registration Code`,
    html:    otpTemplate(otp, 'Email Verification', 10),
    text:    `Your Manki Party registration OTP is: ${otp}. Valid for 10 minutes.`,
  });
}

export async function sendPasswordResetOtp(email: string, otp: string) {
  await transporter.sendMail({
    from:    `"Manki Party" <${process.env.EMAIL_FROM}>`,
    to:      email,
    subject: `${otp} — Reset Your Manki Party Password`,
    html:    otpTemplate(otp, 'Password Reset', 10),
    text:    `Your Manki Party password reset OTP is: ${otp}. Valid for 10 minutes.`,
  });
}

export async function sendSensitiveActionOtp(email: string, otp: string, action: string) {
  await transporter.sendMail({
    from:    `"Manki Party" <${process.env.EMAIL_FROM}>`,
    to:      email,
    subject: `${otp} — Security Verification Code`,
    html:    otpTemplate(otp, `Security Verification: ${action}`, 10),
    text:    `Your security OTP is: ${otp}. Valid for 10 minutes.`,
  });
}
