"use client"

import { logout } from "@/actions/logout"

interface logoutButtonProps {
    children? : React.ReactNode
}

const Logout = ({children}:logoutButtonProps) => {
    const onClick = () => {
        logout()
    }
  return (
    <span className="cursor-pointer" onClick={onClick}>{children}</span>
  )
}

export default Logout