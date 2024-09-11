"use client"

import useCurrentRole from "@/hooks/useCurrentRole"
import { UserRole } from "@prisma/client"
import FormError from "../FormError"

interface RoleGateProps {
    children?: React.ReactNode
    allowedRole : UserRole
}

export const RoleGate = ({allowedRole,children}:RoleGateProps)=>{
    const role = useCurrentRole()
    console.log(role)
    if(role !== allowedRole){
        return (
            <FormError message="You do have permission to view this content " />
        )

    }
    return (
        <>
        {children}
        </>
    )
}