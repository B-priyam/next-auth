import { auth } from '@/auth'
import UserInfo from '@/components/UserInfo'
import { currentUser } from '@/lib/auth'
import React from 'react'

const ServerPage = async () => {
    const user = await currentUser()
  return (
    <UserInfo
    user = {user}
    label= 'server component'
    />
  )
}

export default ServerPage