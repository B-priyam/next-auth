import NextAuth from "next-auth"
import authConfig from "./auth.config" 
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getAccountByuserId } from "./data/accont"


export const { 
    auth, 
    handlers:{
        GET,POST
    }, 
    signIn,
    signOut } =
     NextAuth({
        pages :{
            signIn : "/auth/login",
            error : "/auth/error"
        },
        events :{
           async linkAccount({user}) {
                await db.user.update({
                    where :{
                        id:user.id
                    },
                    data :{
                        emailVerified : new Date()
                    }
                })
            }
        },

    callbacks : {
        async signIn({user,account}){
            if(account?.provider !== 'credentials'){
                return true
            }

            const existingUser  = await getUserById(user.id!)

            if(!existingUser?.emailVerified){
                return false
            }

            if(existingUser.isTwoFactor){
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
                if(!twoFactorConfirmation){
                    return false
                }

                await db.twoFactorConfirmation.delete({
                    where :{
                        id:twoFactorConfirmation.id
                    }
                })
            }
            

            return true
        },
        async session ({session,token}){
            if(session.user && token.sub){
                session.user.id = token.sub
            }
            if(session.user && token.role){
                session.user.role = token.role as UserRole
            }
            if(session.user){
                session.user.isTwoFactor = token.isTwoFactor as boolean
            }

            if(session.user){
                session.user.name = token.name;
                session.user.email = token.email as string
                session.user.isOAuth = token.isOAuth as boolean

            }
            return session
        },
        async jwt({token}){
            if(!token.sub){
                return token
            }
            const existingUser = await getUserById(token.sub)


            if(!existingUser) return token

            const existingAccount = await getAccountByuserId(existingUser.id)

            token.isOAuth = !!existingAccount
            token.name = existingUser.name
            token.email = existingUser.email
            token.role = existingUser.role
            token.isTwoFactor = existingUser.isTwoFactor

            return token

        }
    },
    adapter:PrismaAdapter(db),
    session : {strategy : 'jwt'},
    ...authConfig,
})