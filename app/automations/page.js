"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AutomationsPage() {
    return (
        <div className="font-sans min-h-[calc(100vh-64px)] xl:min-h-screen flex flex-col -mx-6 sm:-mx-8 xl:-mx-12 -mt-6">
            {/* Top Beige Banner */}
            <div className="bg-[#fcf5eb] w-full pt-16 pb-12 px-6 flex flex-col items-center text-center">
                <span className="text-[#4a5568] font-semibold text-[15px] mb-3">
                    Get started with Automations
                </span>
                <h1 className="text-[40px] sm:text-[44px] leading-tight font-bold text-[#001b12] mb-4">
                    Easy automation for effortless growth
                </h1>
                <p className="text-[#4a5568] text-[15.5px] max-w-[700px] leading-relaxed mb-8">
                    Increase your efficiency by automating work. You can draft automations at any stage of your Brevo journey:
                    they'll be ready to go once your user profile is complete. Discover our feature's potential, and let Automation do
                    the work for you!
                </p>

                <div className="flex items-center gap-6">
                    <Link
                        href="#"
                        className="flex items-center gap-1.5 text-[#4a5568] font-semibold text-[15px] hover:text-[#001b12] transition-colors underline decoration-slate-300 underline-offset-4"
                    >
                        Learn to automate <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button className="px-6 py-3 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors shadow-sm">
                        Create your first automation
                    </button>
                </div>
            </div>

            {/* Illustration Area */}
            <div className="flex-1 bg-white w-full flex justify-center items-start pt-12 px-6">
                <div className="relative w-full max-w-2xl h-64 md:h-96">
                    {/* Abstract illustration matching the screenshot style */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end">

                        {/* Abstract shapes left */}
                        <div className="relative w-32 h-40 mr-[-20px] mb-[-10px] z-0">
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border-2 border-[#009262] bg-[#fcf5eb]"></div>
                            <div className="absolute top-8 right-4 w-16 h-16 bg-[#e8f7ec] border-2 border-[#001b12]"></div>
                            <div className="absolute top-0 left-8 w-4 h-4 rounded-full border-2 border-[#009262]"></div>
                            <div className="absolute top-12 left-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#009262]"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg></div>
                        </div>

                        {/* Person */}
                        <div className="relative z-10 flex flex-col items-center">
                            {/* Head/Hair */}
                            <div className="relative w-28 h-28 bg-[#009262] rounded-t-full rounded-bl-full rounded-br-md border-2 border-[#001b12] -mb-4 z-20 overflow-hidden text-center flex flex-col items-center pt-8">
                                <div className="w-16 h-12 bg-[#faeade] rounded-b-full border-2 border-[#001b12] border-t-0 mx-auto"></div>
                            </div>
                            {/* Body */}
                            <div className="w-48 h-32 bg-[#cbece6] border-2 border-[#001b12] rounded-t-[40px] flex items-end px-4">
                                <div className="w-20 h-16 bg-[#fcf5eb] border-2 border-[#001b12] rounded-t-md mx-auto relative bottom-[-2px]">
                                    <div className="absolute top-0 right-[-10px] w-6 h-6 bg-[#009262] border-2 border-[#001b12]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Abstract shapes right */}
                        <div className="relative w-40 h-48 ml-[-20px] mb-[-10px] z-0">
                            <div className="absolute bottom-10 left-4 w-20 h-24 bg-[#fcf5eb] border-2 border-[#001b12] flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#009262]"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                            </div>
                            <div className="absolute top-4 left-0 w-16 h-20 bg-[#cbece6] border-2 border-[#001b12] rounded-tr-[40px]"></div>
                            <div className="absolute top-16 right-0 w-8 h-8 flex items-center justify-center"><span className="text-[#009262] text-xl">+</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
