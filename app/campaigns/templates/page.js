"use client";

import { Crown } from "lucide-react";

export default function TemplatesPage() {
    return (
        <div className="font-sans max-w-[1200px] relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[32px] font-semibold text-[#001b12]">Templates</h1>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#001b12] border border-[#e6e9eb] rounded-[12px] text-[15px] font-semibold hover:bg-[#f3f4f6] transition-colors shadow-sm">
                        <Crown className="w-4 h-4 text-[#ffdb5c]" strokeWidth={2.5} /> Create folder
                    </button>
                    <button className="px-4 py-2 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors shadow-sm">
                        Create Template
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6 border-b border-[#e6e9eb] mb-16">
                <button className="text-[#4e46dc] font-semibold pb-3 border-b-2 border-[#4e46dc]">
                    Email
                </button>
            </div>

            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-10">
                {/* Empty State Illustration Placeholder */}
                <div className="relative w-48 h-32 mb-8">
                    {/* Abstract illustration elements matching the screenshot style */}
                    <div className="absolute top-0 right-0 w-32 h-20 border-2 border-[#001b12] bg-[#f8f9fa] z-10 rounded-sm overflow-hidden flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-slate-300"><path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                    </div>
                    {/* Open box parts */}
                    <div className="absolute top-4 left-6 w-16 h-16 border-2 border-[#001b12] bg-[#e8f7ec] -rotate-[15deg] transform origin-bottom-right z-0"></div>
                    <div className="absolute top-4 right-6 w-16 h-16 border-2 border-[#001b12] bg-[#fffdfa] rotate-[15deg] transform origin-bottom-left z-0"></div>
                    {/* Additional floating items */}
                    <div className="absolute -top-4 -left-2 w-3 h-3 text-[#4e46dc]">+</div>
                    <div className="absolute bottom-4 -right-4 w-2 h-2 rounded-full border border-purple-400 bg-purple-100"></div>
                    <div className="absolute top-8 right-8 w-3 h-3 rounded-full border border-teal-500 bg-teal-100 z-20"></div>
                </div>

                <h3 className="text-[#001b12] text-[18px] font-bold mb-3">
                    You have not created any Email templates.
                </h3>
                <p className="text-[#4a5568] text-[15px]">
                    Your newly created templates will appear here.
                </p>
            </div>
        </div>
    );
}
