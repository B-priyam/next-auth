"use server"
import * as z from "zod"
import { RegisterSchema } from "@/schema"
import bcrypt from "bcrypt"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVarificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const register = async (values:z.infer<typeof RegisterSchema>) => {
    const validatedField = RegisterSchema.safeParse(values)
    if(!validatedField.success){
        return {error : "invalid field"}
    }
    
    const {email,name,password} = validatedField.data
    const hashedPassword = await bcrypt.hash(password,10);
    
    const existingUser = await getUserByEmail(email
        
    )
    
    if (existingUser){
        return {error : "Email already in use"}
    }

    await db.user.create({
        data:{
            name,
            email,
            password : hashedPassword
        }
    })

    const varificationToken = await generateVarificationToken(email)
    await sendVerificationEmail(
        varificationToken.email,
        varificationToken.token
    )

    return {success : 'Confirmation email send'}
}