"use client";

import { ChevronLeft, ChevronRight, LayoutTemplate, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust so Monday is 0, Sunday is 6
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayIdx = getFirstDayOfMonth(currentDate);

        // Previous month days
        const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

        const days = [];

        // Add previous month filler days
        for (let i = firstDayIdx - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                isToday: false
            });
        }

        // Add current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday =
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear() &&
                i === today.getDate();

            days.push({
                day: i,
                isCurrentMonth: true,
                isToday
            });
        }

        // Add next month filler days to complete the grid (42 cells to ensure 6 rows)
        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isToday: false
            });
        }

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthName = monthNames[currentDate.getMonth()];
    const currentYearStr = currentDate.getFullYear();
    const calendarDays = generateCalendarDays();

    return (
        <div className="max-w-[1000px] font-sans">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h1 className="text-[32px] font-semibold text-[#001b12]">Hello Priti</h1>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-[14px] font-semibold text-[#4e46dc] hover:text-[#3b35a8] transition-colors">
                        <LayoutTemplate className="w-4 h-4" />
                        Customize page
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e9eb] rounded-full text-[14px] font-semibold text-[#001b12] hover:bg-[#f3f4f6] transition-colors shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2.57 13.91c.07-.11.13-.22.18-.34a4.15 4.15 0 0 1 7.42-1.25L12 14.5l1.79-2.13a4.15 4.15 0 0 1 7.42 1.25c.05.12.11.23.18.34" /><path d="M3.5 13H21" /><path d="M3.5 13V6" /><path d="M20.5 13V6" /><path d="M12 21v-7" /></svg>
                        Upgrade now
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
                {/* Left Column - Calendar */}
                <div className="lg:col-span-4 bg-white rounded-[24px] border border-[#e6e9eb] p-6 shadow-sm flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-6">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-[#f3f4f6] rounded-full text-[#4e46dc] transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-[15px] font-semibold text-[#001b12]">{currentMonthName} {currentYearStr}</h2>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-[#f3f4f6] rounded-full text-[#4e46dc] transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="w-full grid grid-cols-7 gap-y-4 gap-x-1 text-center text-[13px]">
                        {/* Days Header */}
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-[#8e99a8] font-medium">{day}</div>
                        ))}

                        {/* Calendar Grid */}
                        {calendarDays.map((dateObj, idx) => (
                            <div
                                key={idx}
                                className={`
                                    relative flex w-full justify-center items-center py-1 
                                    ${dateObj.isCurrentMonth ? 'text-[#001b12] hover:bg-slate-50 cursor-pointer rounded-md transition-colors' : 'text-[#8e99a8] cursor-default'}
                                    ${dateObj.isCurrentMonth && !dateObj.isToday ? 'font-medium' : ''}
                                `}
                            >
                                {dateObj.isToday ? (
                                    <div className="absolute w-8 h-8 bg-[#4e46dc] rounded-full flex items-center justify-center text-white font-semibold">
                                        {dateObj.day}
                                    </div>
                                ) : (
                                    <span>{dateObj.day}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Top Widget */}
                <div className="lg:col-span-8 bg-[#fffdfa] rounded-[24px] border border-[#e6e9eb] p-8 shadow-sm relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-start mb-12 relative z-10">
                        <h2 className="text-[22px] font-semibold text-[#001b12]">Get started with Warmwrite</h2>
                        <Link href="/campaigns/create" className="bg-[#001b12] text-white px-5 py-2.5 rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors inline-block text-center">
                            Create campaign
                        </Link>
                    </div>

                    {/* Inner Card */}
                    <div className="bg-white rounded-[16px] border border-[#e6e9eb] p-6 max-w-[480px] mx-auto w-full relative z-10 shadow-sm mt-auto mb-6">
                        <h3 className="text-[17px] font-semibol11d text-[#001b12] mb-2">Add your first contacts</h3>
                        <p className="text-[14px] text-[#4a5568] mb-6 leading-relaxed">
                            You need contacts to create a campaign. Build your contact
                            database or add the recipients of your first campaign.
                        </p>
                        <div className="flex justify-end">
                            <button className="flex items-center gap-2 text-[#4e46dc] font-semibold text-[15px] hover:text-[#3b35a8] transition-colors">
                                Import your contacts
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute left-6 bottom-4 text-[#009262] opacity-90 select-none z-0">
                        <svg width="120" height="140" viewBox="0 0 100 120" fill="none" className="transform -rotate-6">
                            <path d="M 60 110 L 60 30 L 40 45 L 40 60 L 50 50 L 50 110 Z" fill="currentColor" />
                            <path d="M 30 50 Q 40 20 60 10 Q 70 30 65 60" stroke="#e8f7ec" strokeWidth="2" fill="#f3faf6" />
                            <path d="M 60 100 Q 80 120 40 120 Q 20 100 30 80" stroke="#e8f7ec" strokeWidth="2" fill="none" />
                        </svg>
                    </div>

                    <div className="absolute right-0 bottom-8 text-[#009262] opacity-90 select-none z-0">
                        <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
                            <path d="M 20 100 L 80 100 L 80 80 L 40 80 Q 70 60 70 40 Q 70 20 50 20 Q 30 20 30 40 L 45 40 Q 45 30 50 30 Q 55 30 55 40 Q 55 50 30 70 Z" fill="currentColor" />
                            <path d="M 20 100 Q 10 120 40 120" stroke="#e8f7ec" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                </div>

                {/* Bottom Row placeholers */}
                <div className="lg:col-span-6 bg-white rounded-[24px] border border-[#e6e9eb] p-8 shadow-sm min-h-[160px]">
                    <h3 className="text-[18px] font-semibold text-[#001b12] text-center mt-8">Organize your contacts to</h3>
                </div>
                <div className="lg:col-span-6 bg-white rounded-[24px] border border-[#e6e9eb] p-8 shadow-sm min-h-[160px]">
                    <h3 className="text-[18px] font-semibold text-[#001b12]">Your plan usage</h3>
                </div>
            </div>
        </div>
    );
}
