"use server"

import * as z from "zod"
import { db } from "@/lib/db"
import { settingsSchema } from "@/schema"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { generateVarificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import bcrypt from "bcryptjs"

export const settings =  async(values : z.infer<typeof settingsSchema>)=>{
    const user = await currentUser()
    if(!user){
        return {error : "unauthorized"}
    }

    
    const dbUser = await getUserById(user.id!)
    if(!dbUser){
        return {error : "unauthorized"}
    }

    if(user.isOAuth){
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.isTwoFactor = undefined
    }

    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email)
        if(existingUser && existingUser.id !==user.id ){
            return {error : "email already in use"}
        }
        
        const verificationToken = await generateVarificationToken(values.email!)
        
        await sendVerificationEmail(verificationToken.email,verificationToken.token)

        return {success : "verification email sent"}
        
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordMatched = await bcrypt.compare(values.password , dbUser.password)
        
        if(!passwordMatched){
            return {error : "incorrect password"}
        }

        const hashedPassword = await bcrypt.hash(values.newPassword,10)

        values.password = hashedPassword
        values.newPassword = undefined
    }
        await db.user.update({
            where:{
            id:dbUser.id
        },
        data:{
            ...values
        }
    })
    return {success : 'settings updated'}
}
