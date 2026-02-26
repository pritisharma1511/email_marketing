"use client";

import { usePathname } from "next/navigation";
import SidebarLayout from "@/components/SidebarLayout";

export default function ClientLayout({ children }) {
    const pathname = usePathname();

    // Auth pages don't get the sidebar
    if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/') {
        return children;
    }

    return <SidebarLayout>{children}</SidebarLayout>;
}
