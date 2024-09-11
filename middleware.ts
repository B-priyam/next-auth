import { NextRequest } from "next/server"
import authConfig from "@/auth.config"
import NextAuth from "next-auth"
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes"
 
// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)
 
// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)


export default auth (function middleware(req:any){
    const {nextUrl} = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if(isApiAuthRoute){
        return null
    }

    if(isAuthRoute){
        if (isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return null
    }

    if(!isLoggedIn && !isPublicRoute){
        let callbackUrl = nextUrl.pathname
        if(nextUrl.search){
            callbackUrl += nextUrl.search
        }
        const encodedCallbackUrl = encodeURI(callbackUrl)

        return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`,nextUrl))
    }
    return null
})

export const config = {
    matcher :['/((?!.+\\.[\\w]+$|_next).*)', '/',    '/(api|trpc)(.*)',]
}