"use client"
import { useRole } from "@/hooks/use-role"
import NotAuthorized from "@/components/backoffice/NotAuthorized"
import { useSession } from "next-auth/react";

export default function Products() {
    const { data: session } = useSession();
  const { isAdmin, isUser, isVendor } = useRole(session);
  
  if (isUser) {
    return (
      <NotAuthorized />
    )
  }

  return (
      <div className="flex pt-5 justify-center items-center flex-col">
          <h1>wecome to products</h1>
          <h1>User name: {session?.user?.name} with role: {session?.user?.role}</h1>
          {isAdmin && <h2>Viewed by admin</h2>}
          {(isAdmin || isVendor) &&
              <h2>Viewed by admin or vendor</h2>
          }
          <h2>viewed by all users</h2>
    </div>
  )
}