"use server"
import * as z from "zod"
import { LoginSchema } from "@/schema"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT,  } from "@/routes"
import { AuthError } from "next-auth"
import { getUserByEmail } from "@/data/user"
import { generateTwoFactorToken, generateVarificationToken } from "@/lib/tokens"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { getTwoFactorTokenByEmail } from "@/data/Two-Factor-Token"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

export const login = async (values:z.infer<typeof LoginSchema>,callbackUrl?:string|null) => {
    const validatedField = LoginSchema.safeParse(values)
    if(!validatedField.success){
        return {error : "invalid field"}
    }

    const {email,password,code}  =  validatedField.data

    const existingUser = await getUserByEmail(email)
    if(!existingUser?.email || !existingUser.password || !existingUser){
        return {error: "Email does not exists"}
    }

    if(!existingUser.emailVerified){
        const varificationToken = await generateVarificationToken(existingUser.email)

        // console.log(varificationToken)
        const emailSend = await sendVerificationEmail(
            varificationToken.email,
            varificationToken.token
        )

        return {success : "Confirmation email sent\
            "}
        }

        if(existingUser.isTwoFactor && existingUser.email){
            if(code){
                const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
                if(!twoFactorToken){
                    return {error : "invalid code"}
                }
                if(twoFactorToken.token !== code){
                    return {error : "invalid code"}
                }
                const hasExpired = new Date(twoFactorToken.expires) < new Date()
                if(hasExpired){
                    return {error : "code expired"}
                }

                await db.twoFactorToken.delete({
                    where:{
                        id : twoFactorToken.id
                    }
                })

                const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

                if(existingConfirmation){
                    await db.twoFactorConfirmation.delete({
                        where:{id:existingConfirmation.id}
                    })
                }

                await db.twoFactorConfirmation.create({
                    data:{
                        userId :existingUser.id
                    }
                })
            }else {
                const twoFactorToken = await generateTwoFactorToken(existingUser.email)
                await sendTwoFactorTokenEmail(twoFactorToken.email,twoFactorToken.token)
                return {twofactor :true}
            }
            }
            

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl|| DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin" :
                    return {error : "invalid credentials"}
                default :
                    return {error : "something went wrong"}
            }
        }
        throw error
    }
}