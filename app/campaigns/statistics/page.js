"use client";

import { BarChart3, Calendar as CalendarIcon, Info } from "lucide-react";

export default function StatisticsPage() {
    return (
        <div className="font-sans max-w-[1200px] relative">
            <h1 className="text-[32px] font-semibold text-[#001b12] mb-6">Statistics</h1>

            <div className="flex items-center gap-6 border-b border-[#e6e9eb] mb-8">
                <button className="text-[#4e46dc] font-semibold pb-3 border-b-2 border-[#4e46dc]">
                    Campaigns
                </button>
                <button className="text-[#4a5568] font-medium pb-3 hover:text-[#001b12] transition-colors">
                    Conversions
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Area - Calendars */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center border border-[#e6e9eb] rounded-[8px] bg-white overflow-hidden shadow-sm">
                            <input
                                type="text"
                                value="Sunday.25-01-2026"
                                readOnly
                                className="px-3 py-2 text-[14px] text-[#4a5568] w-40 focus:outline-none"
                            />
                            <div className="px-3 py-2 border-l border-[#e6e9eb] bg-white text-[#4a5568]">
                                <CalendarIcon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-center border border-[#e6e9eb] rounded-[8px] bg-white overflow-hidden shadow-sm">
                            <input
                                type="text"
                                value="Wednesday.25-02-2026"
                                readOnly
                                className="px-3 py-2 text-[14px] text-[#4a5568] w-48 focus:outline-none"
                            />
                            <div className="px-3 py-2 border-l border-[#e6e9eb] bg-white text-[#4a5568]">
                                <CalendarIcon className="w-4 h-4" />
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors shadow-sm">
                            <BarChart3 className="w-4 h-4" /> Show Statistics
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Fake Calendar 1 (Jan 2026) */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <button className="text-slate-400 hover:text-slate-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <span className="font-medium text-[15px] text-[#4a5568]">January, 2026</span>
                                <div></div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-[13px] mb-2 font-medium text-white">
                                <div className="bg-[#5a6470] py-1 rounded-sm">MO</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">TU</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">WE</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">TH</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">FR</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">SA</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">SU</div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-[14px]">
                                {[29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1].map((day, i) => {
                                    const isGray = i < 3 || i > 33;
                                    const isBlue = i >= 27 && i <= 33; // 25-31
                                    return (
                                        <div key={i} className={`py-1.5 ${isGray ? 'text-slate-300' : isBlue ? 'bg-[#2b8df1] text-white font-medium' : 'text-[#4a5568] hover:bg-slate-100'} ${isBlue && i === 27 ? 'rounded-l' : ''} ${isBlue && i === 33 ? 'rounded-r' : ''} cursor-pointer`}>
                                            {day}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Fake Calendar 2 (Feb 2026) */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <div></div>
                                <span className="font-medium text-[15px] text-[#4a5568]">February, 2026</span>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-[13px] mb-2 font-medium text-white">
                                <div className="bg-[#5a6470] py-1 rounded-sm">MO</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">TU</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">WE</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">TH</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">FR</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">SA</div>
                                <div className="bg-[#5a6470] py-1 rounded-sm">SU</div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-[14px]">
                                {[26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 1].map((day, i) => {
                                    const isGray = i < 6 || i > 33;
                                    const isBlue = i >= 6 && i <= 30; // 1-25
                                    return (
                                        <div key={i} className={`py-1.5 ${isGray && !isBlue ? 'text-slate-300' : isBlue ? 'bg-[#2b8df1] text-white font-medium' : 'text-[#4a5568] hover:bg-slate-100'} ${isBlue && i === 6 ? 'rounded-l' : ''} ${isBlue && i === 30 ? 'rounded-r' : ''} cursor-pointer`}>
                                            {day}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Area - Stats List */}
                <div className="w-full lg:w-72 pt-2">
                    <ul className="space-y-4">
                        <li className="flex items-center gap-2 pb-3 border-b border-[#e6e9eb] text-[15px] font-medium text-[#4a5568]">Sent</li>
                        <li className="flex items-center gap-2 pb-3 border-b border-[#e6e9eb] text-[15px] font-medium text-[#4a5568]">Recipients</li>
                        <li className="flex items-center gap-2 pb-3 border-b border-[#e6e9eb] text-[15px] font-medium text-[#00a7b4]">Opens</li>
                        <li className="flex items-center gap-2 pb-3 border-b border-[#e6e9eb] text-[15px] font-medium text-[#009262]">Clicks</li>
                        <li className="flex items-center gap-2 pb-3 border-b border-[#e6e9eb] text-[15px] font-medium text-[#e37f68]">Unsubscribes</li>
                        <li className="flex items-center gap-2 pb-3 border-b border-[#e6e9eb] text-[15px] font-medium text-[#7cc280]">Replies</li>
                        <li className="flex items-center gap-2 pb-3 border-b border-[#e6e9eb] text-[15px] font-medium text-[#e37f68]">Soft + Hard Bounces</li>
                    </ul>
                    <div className="mt-8 flex items-center gap-2 text-[13px] text-[#4a5568]">
                        <div className="w-2 h-2 rounded-full bg-[#cbd5e1]"></div>
                        Apple MPP opens included <Info className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
