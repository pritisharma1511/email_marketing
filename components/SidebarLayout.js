"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home, Users, Send, GitMerge, RefreshCw, MessageSquare, ShoppingBag,
    HelpCircle, Settings, Bell, ChevronDown, Activity, Menu, X, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    {
        name: "CRM",
        icon: Users,
        activePaths: ["/contacts", "/lists", "/segments", "/companies", "/deals", "/tasks", "/custom-objects"],
        subItems: [
            { name: "Contacts", href: "/contacts" },
            { name: "Lists", href: "/lists" },
            { name: "Segments", href: "/segments" },
            { name: "Companies", href: "/companies" },
            { name: "Deals", href: "/deals" },
            { name: "Tasks", href: "/tasks" },
            { name: "Custom objects", href: "/custom-objects" },
        ]
    },
    {
        name: "Marketing",
        icon: Send,
        activePaths: ["/campaigns"],
        subItems: [
            { name: "Campaigns", href: "/campaigns" },
            { name: "Forms", href: "/campaigns/forms" },
            { name: "Statistics", href: "/campaigns/statistics" },
            { name: "Templates", href: "/campaigns/templates" },
        ]
    },
    { name: "Automations", href: "/automations", icon: GitMerge },
    { name: "Transactional", href: "/transactional", icon: RefreshCw },
    { name: "Conversations", href: "/conversations", icon: MessageSquare },
    { name: "Commerce", href: "/commerce", icon: ShoppingBag },
];

export default function SidebarLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-white flex font-sans">
            {/* Mobile Sidebar Overlay */}
            <div
                className={cn("fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm xl:hidden", sidebarOpen ? "block" : "hidden")}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-[240px] bg-[#fffdfa] border-r border-[#e6e9eb] transform transition-transform duration-200 ease-in-out xl:translate-x-0 xl:static xl:block flex flex-col pt-6 overflow-y-auto no-scrollbar",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="px-6 mb-8 flex items-center justify-between sticky top-0 bg-[#fffdfa] z-10 py-2">
                    <Link href="/dashboard" className="flex items-center gap-2 text-[#001b12] font-bold text-2xl tracking-tight">
                        <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#7CD142]">
                            <path d="M15 30 L30 80 L50 40 L70 80 L85 30" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 30 C 10 15, 30 10, 50 15 C 70 20, 80 10, 85 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <path d="M85 30 C 95 10, 110 20, 95 45 L 88 65" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                            <polygon points="78,65 98,65 88,88" fill="currentColor" />
                        </svg>
                        <span>Warmwrite</span>
                    </Link>
                    <button className="xl:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="px-3 flex-1 space-y-1">
                    {navigation.map((item) => {
                        const isCrmActive = item.activePaths?.some(p => pathname.startsWith(p));
                        const isActive = item.href ? (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))) : isCrmActive;
                        const hasSubItems = !!item.subItems;

                        return (
                            <div key={item.name} className="flex flex-col mb-1 relative">
                                <Link
                                    href={item.href || item.subItems[0].href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-colors font-medium text-[15px] relative",
                                        isActive && !hasSubItems
                                            ? "bg-[#e8f7ec] text-[#001b12]"
                                            : "text-[#4a5568] hover:bg-[#f3f4f6]"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-[#001b12]" : "text-[#4a5568]")} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className={cn(isActive ? "text-[#001b12]" : "")}>{item.name}</span>
                                    {isActive && !hasSubItems && (
                                        <div className="absolute left-[-12px] w-1 h-8 bg-[#009262] rounded-r-md" />
                                    )}
                                </Link>

                                {hasSubItems && isCrmActive && (
                                    <div className="pl-11 pr-3 flex flex-col gap-1 mt-1 pb-4 relative">
                                        {/* Vertical connector line for sub-menu */}
                                        <div className="absolute left-[21px] top-0 bottom-6 w-[2px] bg-[#e6e9eb]" />

                                        {item.subItems.map(sub => {
                                            const isSubActive = pathname.startsWith(sub.href);
                                            return (
                                                <Link key={sub.name} href={sub.href} className={cn(
                                                    "relative px-3 py-2 rounded-[8px] text-[14px] font-medium transition-colors flex items-center justify-between",
                                                    isSubActive ? "bg-[#e8f7ec] text-[#001b12]" : "text-[#4a5568] hover:bg-[#f3f4f6]"
                                                )}>
                                                    <span>{sub.name}</span>
                                                    {sub.premium && (
                                                        <div className="bg-[#ffdb5c] p-0.5 rounded-full">
                                                            <Crown className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                                                        </div>
                                                    )}
                                                    {isSubActive && (
                                                        <div className="absolute left-[-32px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#009262] rounded-r-md z-10" />
                                                    )}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header (Only visible on small screens) */}
                <header className="h-16 bg-white border-b border-[#e6e9eb] flex items-center justify-between px-4 xl:hidden sticky top-0 z-30">
                    <Link href="/dashboard" className="flex items-center gap-2 text-[#001b12] font-bold text-xl">
                        <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#7CD142]">
                            <path d="M15 30 L30 80 L50 40 L70 80 L85 30" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 30 C 10 15, 30 10, 50 15 C 70 20, 80 10, 85 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <path d="M85 30 C 95 10, 110 20, 95 45 L 88 65" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                            <polygon points="78,65 98,65 88,88" fill="currentColor" />
                        </svg>
                        <span>Warmwrite</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Top Header Controls (Desktop mainly) */}
                <div className="hidden xl:flex absolute top-6 right-8 items-center gap-6 z-10">
                    <button className="flex items-center gap-2 text-[14px] font-semibold text-[#001b12] hover:text-[#009262] transition-colors">
                        <Activity className="w-4 h-4" />
                        Usage and plan
                    </button>
                    <div className="flex items-center gap-4 text-[#001b12]">
                        <button className="p-1 hover:bg-[#f3f4f6] rounded-full transition-colors">
                            <HelpCircle className="w-[18px] h-[18px]" />
                        </button>
                        <button className="p-1 hover:bg-[#f3f4f6] rounded-full transition-colors">
                            <Settings className="w-[18px] h-[18px]" />
                        </button>
                        <button className="p-1 hover:bg-[#f3f4f6] rounded-full transition-colors">
                            <Bell className="w-[18px] h-[18px]" />
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="flex items-center gap-2 text-[14px] font-semibold text-[#001b12] hover:bg-[#f3f4f6] px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#e6e9eb]"
                    >
                        <span className="flex items-center gap-1 group">
                            <span className="w-5 h-5 bg-[#001b12] text-white rounded-[4px] flex items-center justify-center text-[11px] mr-1 font-bold">
                                X
                            </span>
                            xtra-fusion
                            <ChevronDown className="w-4 h-4 ml-1 text-slate-500" />
                        </span>
                    </button>
                </div>


                <div className="flex-1 overflow-auto bg-white xl:pt-16">
                    <div className="w-full px-6 sm:px-8 xl:px-12 pb-12 pt-6 max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
