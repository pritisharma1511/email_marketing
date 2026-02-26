"use client";

export default function FormsPage() {
    return (
        <div className="font-sans max-w-[1200px] relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[32px] font-semibold text-[#001b12]">Forms</h1>
                <button className="px-4 py-2 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors shadow-sm">
                    Create sign-up form
                </button>
            </div>

            <div className="flex items-center gap-6 border-b border-[#e6e9eb] mb-16">
                <button className="text-[#4e46dc] font-semibold pb-3 border-b-2 border-[#4e46dc]">
                    Sign-up
                </button>
                <button className="text-[#4a5568] font-medium pb-3 hover:text-[#001b12] transition-colors">
                    Unsubscribe
                </button>
                <button className="text-[#4a5568] font-medium pb-3 hover:text-[#001b12] transition-colors">
                    Profile update
                </button>
            </div>

            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-10">
                {/* Empty State Illustration Placeholder */}
                <div className="relative w-64 h-48 mb-6">
                    {/* Abstract illustration elements matching the screenshot style */}
                    <div className="absolute top-4 left-8 w-12 h-12 rounded-full border border-[#009262] bg-[#e8f7ec]"></div>
                    <div className="absolute top-10 right-12 w-4 h-4 text-[#009262]">+</div>
                    <div className="absolute top-20 right-8 w-8 h-8 flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#009262]"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /></svg></div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#f3f4f6] rounded-[100%] border border-[#001b12]"></div>
                    {/* Character simplified */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-24">
                        <div className="absolute bottom-0 left-0 w-8 h-16 bg-[#e8f7ec] border border-[#001b12] rotate-[-30deg] origin-bottom transform"></div>
                        <div className="absolute bottom-0 right-8 w-16 h-16 bg-[#009262] border border-[#001b12] rounded-t-xl transform"></div>
                        <div className="absolute top-[-10px] right-12 w-10 h-10 bg-[#e8f7ec] border border-[#001b12] rounded-full"></div>
                    </div>
                </div>

                <p className="text-[#001b12] text-[15px] font-medium mb-3">
                    50% of marketers says forms are their highest converting lead generation tool.
                </p>
                <p className="text-[#4a5568] text-[13px] mb-8">
                    Get your web visitors and prospects to subscribe to your marketing campaigns.
                </p>

                <button className="px-5 py-2.5 border border-[#e6e9eb] bg-white text-[#001b12] rounded-[12px] text-[15px] font-semibold hover:bg-[#f3f4f6] transition-colors shadow-sm">
                    Create sign-up form
                </button>
            </div>
        </div>
    );
}
