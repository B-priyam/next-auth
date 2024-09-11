import {Resend} from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXT_PUBLIC_APP_URL
export const sendVerificationEmail = async (
    email:string,token:string
)=>{
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    await resend.emails.send({
        from :"onboarding@resend.dev",
        to:email,
        subject:'confirm your email',
        html:`<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    })
    
}

export const sendPasswordResetEmail = async (email:string,token:string)=>{
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

    await resend.emails.send({
        from : 'onboarding@resend.dev',
        to : email,
        subject : 'Reset your password',
        html : `<p>Click <a href="${resetLink}">here</a> to reset Password.</p>`
    })
}

export const sendTwoFactorTokenEmail = async (email:string,token:string)=>{

    await resend.emails.send({
        from : 'onboarding@resend.dev',
        to : email,
        subject : '2 factor auth code',
        html : `<p>Your Two factor code ${token}.</p>`
    })
}