import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }
  
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
