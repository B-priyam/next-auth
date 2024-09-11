"use client"

import { RoleGate } from "@/components/auth/RoleGate"
import FormSuccess from "@/components/FormSuccess"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import useCurrentRole from "@/hooks/useCurrentRole"
import { UserRole } from "@prisma/client"


const AdminPage = () => {
    const role = useCurrentRole()
  return (
    <Card className="w-[600px]">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">
                Admin
            </p>
        </CardHeader>
        <CardContent className="space-y-4">
            <RoleGate allowedRole={UserRole.ADMIN}>
                 <FormSuccess  message="you are allowed to see this content"/>
            </RoleGate>
        </CardContent>
    </Card>
  )
}

export default AdminPage