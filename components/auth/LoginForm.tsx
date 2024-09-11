"use client"

import React, { useState } from 'react'
import CardWrapper from './CardWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { LoginSchema } from '@/schema'
import { useTransition } from 'react'
import { useSearchParams } from 'next/navigation'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../FormError'
import FormSuccess from '../FormSuccess'
import { login } from '@/actions/login'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LoginForm = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
   
    if(pathname !== "/auth/login"){
        window.location.reload()
    }

    const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? "email already in use with different provider" : ""
    const callbackUrl = searchParams.get("callbackUrl")
    const [showTwoFactor,setShowTwoFactor] = useState(false)
    const [error,setError] = useState<string | undefined>('')
    const [success,setSuccess] = useState<string | undefined>('')
    const [isPending,startTransition] = useTransition()
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver : zodResolver(LoginSchema),
        defaultValues : {
            email : "",
            password : ""
        }
    })

    

    const onSubmit = (values:z.infer<typeof LoginSchema>)=>{
        setError('')
        setSuccess('')
        startTransition(()=>{
            login(values,callbackUrl).then((data)=>{
                if(data?.error){
                    form.reset()
                    setError(data.error)
                }
                if(data?.success){
                    form.reset()
                    setError(data.success)
                }
                if(data?.twofactor){
                    setShowTwoFactor(true)
                }
            }).catch(()=>{
                setError('something went wrong')
            })
        })
    }
  return (
    <CardWrapper
     headerLabel='welcome back'
     backButtonLabel="Don't have an account?"
     backButtonHref='/auth/register'
     showSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    {showTwoFactor && (
                        <FormField control={form.control} name='code' render={({field})=>(
                            <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input 
                                disabled={isPending}
                                {...field}
                                placeholder='123456'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    )}
                    {!showTwoFactor && (

                        <>
                        <FormField control={form.control} name='email' render={({field})=>(
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input 
                                disabled={isPending}
                                {...field}
                                placeholder='JoanDoe@eg.com'
                                type='email'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                <FormField control={form.control} name='password' render={({field})=>(
                    <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input 
                                disabled={isPending}
                                {...field}
                                placeholder='******'
                                type='password'
                                />
                            </FormControl>
                            <Button className='px-0 font-normal' size={"sm"} variant={"link"} asChild>
                                <Link href={'/auth/reset'}>Forgot Password?</Link>
                            </Button>
                            <FormMessage />
                        </FormItem>
                    )}/>

                    </>
)
                }
                </div>
                <FormError message={error || urlError}/>
                <FormSuccess message={success}/>
                <Button type='submit' className='w-full' disabled={isPending}>
                    {showTwoFactor ? 'Confirm' : 'Login'}
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default LoginForm