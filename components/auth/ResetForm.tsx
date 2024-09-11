"use client"

import React, { useState } from 'react'
import CardWrapper from './CardWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { LoginSchema, ResetSchema } from '@/schema'
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
import { reset } from '@/actions/reset'

const ResetForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [error,setError] = useState<string | undefined>('')
    const [success,setSuccess] = useState<string | undefined>('')
    const [isPending,startTransition] = useTransition()
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver : zodResolver(ResetSchema),
        defaultValues : {
            email : "",
        }
    })

    const onSubmit = (values:z.infer<typeof ResetSchema>)=>{
        setError('')
        setSuccess('')
        startTransition(()=>{
            reset(values).then((data)=>{
                setError(data?.error)
                setSuccess(data?.success)
            })
        })
    }
  return (
    <CardWrapper
     headerLabel='Forgot your password?'
     backButtonLabel="Back to Login?"
     backButtonHref='/auth/login'
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
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

                </div>
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button type='submit' className='w-full' disabled={isPending}>
                    Send Reset Email
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default ResetForm