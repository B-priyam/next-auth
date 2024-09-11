"use client"

import React, { useState } from 'react'
import CardWrapper from './CardWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { LoginSchema, NewPasswordSchema, ResetSchema } from '@/schema'
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
import { newPassword } from '@/actions/new-password'

const NewPasswordForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [error,setError] = useState<string | undefined>('')
    const [success,setSuccess] = useState<string | undefined>('')
    const [isPending,startTransition] = useTransition()
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver : zodResolver(NewPasswordSchema),
        defaultValues : {
            password : "",
        }
    })

    const onSubmit = (values:z.infer<typeof NewPasswordSchema>)=>{
        setError('')
        setSuccess('')
        startTransition(()=>{
            newPassword(values,token).then((data)=>{
                setError(data?.error)
                setSuccess(data?.success)
            })
        })
    }
  return (
    <CardWrapper
     headerLabel='Enter a new password'
     backButtonLabel="Back to Login?"
     backButtonHref='/auth/login'
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
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
                            <FormMessage />
                        </FormItem>
                    )}/>

                </div>
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button type='submit' className='w-full' disabled={isPending}>
                    Reset Password
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default NewPasswordForm