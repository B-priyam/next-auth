"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { settings } from '@/actions/settings'
import { useTransition } from 'react'
import { useSession } from 'next-auth/react'
import * as z from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
  FormDescription
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { settingsSchema } from '@/schema'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import FormError from '@/components/FormError'
import FormSuccess from '@/components/FormSuccess'
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue
} from "@/components/ui/select"
import { UserRole } from '@prisma/client'
import { Switch } from '@/components/ui/switch'

const SettingsPage =  () => {
  const user = useCurrentUser()
  const {update} = useSession()
  const [isPending,startTransition] = useTransition()
  const [error ,setError] = useState<string | undefined>('')
  const [success ,setSuccess] = useState<string | undefined>('')

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver:zodResolver(settingsSchema),
    defaultValues:{
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      isTwoFactor : user?.isTwoFactor || undefined
    }
  })


  const onSubmit = (values : z.infer<typeof settingsSchema>) => {
    console.log(values)
    startTransition(()=>{
      console.log(values)
      settings(values)
      .then((data)=>{
        if(data.error){
          setError(data.error)
        }
        if(data.success){
          update();
          setSuccess(data.success)
        }
      })
      .catch(()=>{
        setError('something went wron')
      })
    })
  }
  return (
    <Card className='w-[600px] '>
      <CardHeader>
        <p className='text-2xl text-center font-semibold'>
          Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4'>
            <FormField 
            control={form.control}
            name="name"
            render={({field})=>(
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} 
                  placeholder='john doe'
                  disabled={isPending}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
            />
            {user?.isOAuth === false && (
              <>
            <FormField 
            control={form.control}
            name={"email"}
            render={({field})=>(
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} 
                  placeholder='example@example.com'
                  disabled={isPending}
                  type='email'
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name={"password"}
            render={({field})=>(
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} 
                  placeholder='******'
                  disabled={isPending}
                  type='password'
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name={"newPassword"}
            render={({field})=>(
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} 
                  placeholder='******'
                  disabled={isPending}
                  type='password'
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
            />
            </>
          )}
            <FormField 
            control={form.control}
            name={"role"}
            render={({field})=>(
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='select a role' />
                    </SelectTrigger>
                    
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>
                      ADMIN
                    </SelectItem>
                    <SelectItem value={UserRole.USER}>
                      USER
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            )}
            />
            {user?.isOAuth === false && (

              <FormField 
              control={form.control}
              name={"isTwoFactor"}
              render={({field})=>(
                <FormItem className='flex flex-row items-center justify-between rounded-lg p-3 shadow-sm '>
                <div className='space-y-0.5'>
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
                    </FormDescription>
                </div>
                <FormControl>
                  <Switch 
                  disabled={isPending}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
            />
          )}
            </div>
            <FormError message={error}/>
            <FormSuccess message={success}/>
            <Button type='submit' disabled={isPending}>save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SettingsPage