"use client"
import { useMemo } from "react";

export const useRole = (session) => {

    const userRole = useMemo(() => session?.user?.role, [session]);

    const roles = {
        isAdmin: userRole === "ADMIN",
        isVendor: userRole === "VENDOR",
        isUser: userRole === "USER"
    };

    return roles;
};
