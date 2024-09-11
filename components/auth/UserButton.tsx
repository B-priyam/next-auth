"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import {
Avatar,
AvatarImage
} from "@/components/ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { FaUser } from "react-icons/fa"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import LoginButton from "./LoginButton"
import Logout from "./Logout"
import { ExitIcon } from "@radix-ui/react-icons"

const UserButton = () => {
    const user = useCurrentUser()
  return (
    <DropdownMenu >
        <DropdownMenuTrigger >
            <Avatar className="" >
                <AvatarImage src={user?.image || ""}  />
                <AvatarFallback className="bg-sky-500 p-3">
                    <FaUser className="text-white" />
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
            <Logout>
            <DropdownMenuItem>
                <ExitIcon className="h-4 w-4 mr-2"/>
                Logout</DropdownMenuItem>
            </Logout>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton