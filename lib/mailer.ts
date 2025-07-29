// lib/mailer.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
})


// Verify SMTP once when this module is imported
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP connection failed:', err)
  } else {
    console.log('✅ SMTP is ready to send emails')
  }
})

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {

  await transporter.sendMail({
    from: `"Child Protection Platform" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}

export async function sendInviteEmail(email: string, inviteToken: string) {
  const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/activate?token=${inviteToken}`

  const mailOptions = {
    from: `"Child Protection Services" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "You're Invited — Activate Your Account",
    html: `
      <p>You've been invited to join the Child Protection Services Directory.</p>
      <p>Please click the link below to activate your account:</p>
      <a href="${activationUrl}" target="_blank">${activationUrl}</a>
    `,
  }

  await transporter.sendMail(mailOptions)
}
