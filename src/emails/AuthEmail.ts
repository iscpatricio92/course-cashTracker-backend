import { transport } from "../config/nodemailer"

type emailType ={
    email: string
    name: string
    token: string
}
export class AuthEmail {
    static sendConfirmationEmail = async (user: emailType) => {
        const email = await transport.sendMail({
            from:'cashTracker isc.patricio@gmail.com',
            to: user.email,
            subject: 'Welcome to cashTracker',
            html: `
                <h1>Welcome to cashTracker</h1>
                <p>Hi ${user.name},</p>
                <p>Thanks for signing up to cashTracker. Please click the link below to confirm your email address:</p>
                <a href="#">To confirm your account introducing this token ${user.token}</a>
            `
        })
        console.log('Message sent: %s', email);
    }

    static sendPasswordResetToken = async (user: emailType) => {
        const email = await transport.sendMail({
            from:'cashTracker isc.patricio@gmail.com',
            to: user.email,
            subject: 'CashTracker Password Reset',
            html: `
                <h1>Cash Password Reset</h1>
                <p>Hi ${user.name},</p>
                <p>Your request for reset password is:</p>
                <a href="#">${user.token}</a>
            `
        })
        console.log('Message sent: %s', email);
    }
}