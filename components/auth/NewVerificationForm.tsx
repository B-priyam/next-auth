"use client"

import React, { useCallback, useEffect, useState } from 'react'
import CardWrapper from './CardWrapper'
import {BeatLoader} from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/new-verification'
import FormError from '../FormError'
import FormSuccess from '../FormSuccess'

const NewVerificationForm = () => {
    const [error,setError] = useState<string | undefined>()
    const [success,setSuccess] = useState<string | undefined>()
    const searchParams = useSearchParams()

    const token = searchParams.get("token")

    const onSubmit = useCallback(()=>{
        if(success || error ) return ;

        if(!token){
            setError('missing token')
            return
        }
       newVerification(token)
       .then((data)=>{
        setError(data.error)
        setSuccess(data.success)
       })
       .catch(()=>{
        setError('something went wrong')
       })
    },[token,success,error])

    useEffect(()=>{
        onSubmit()
    },[onSubmit])

  return (
    <CardWrapper
    headerLabel='Confirming your verification'
    backButtonHref='/auth/login'
    backButtonLabel='Back to login'

    >
        <div className='flex items-center justify-center w-full'>
            {
                !success && !error && (
                    <BeatLoader className='' />
                )
            }
            <FormError message={error} />
            {!success &&
            <FormSuccess message={success} />
            }
        </div>
    </CardWrapper>
  )
}

export default NewVerificationForm