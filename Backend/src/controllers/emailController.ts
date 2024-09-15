import nodemailer from 'nodemailer'
require('dotenv').config()

const EMAIL = process.env.EMAIL
const PASS = process.env.PASS

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL,
        pass: PASS
    }
})

async function sendEmail(to: string, subject: string, html: string) {
    const emailSettings = {
        from: EMAIL,
        to: to,
        subject: subject,
        html: html
    }

    await transporter.sendMail(emailSettings)
}

const EmailController = { sendEmail }

export default EmailController