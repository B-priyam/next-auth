"use server"

import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { getVerificationTokenByToken } from "@/data/verification-token"

export const newVerification = async (token:string)=>{
    const existingToken = await getVerificationTokenByToken(token)
    if(!existingToken){
        return {error : 'token does not exists'}
    }

    const hasExpired = new Date(existingToken.expires) < new Date()
    if(hasExpired ){
        return {error : 'token has expired'}
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if(!existingUser){
        return {error : 'email does not exists'}
    }

    await db.user.update({
        where:{
            id:existingUser.id,

        },
        data :{
            emailVerified : new Date(),
            email : existingToken.email,
        }
    })
    await db.varificationToken.delete({
        where:{
            id : existingToken.id
        }
    })

    return {success : "email verified"}
}