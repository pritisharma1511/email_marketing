"use client";

import { useState, useEffect } from "react";
import { PlayCircle, Settings, PlusCircle, Search, ChevronDown, Loader2, X } from "lucide-react";

export default function DealsPage() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showApp, setShowApp] = useState(false); // Controls if we show Landing Page or Deals App
    const [showAddModal, setShowAddModal] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [stage, setStage] = useState("New");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const stages = ['New', 'Qualified', 'Proposition', 'Won', 'Lost'];

    const fetchDeals = async () => {
        try {
            const res = await fetch("/api/deals");
            const data = await res.json();
            if (res.ok) {
                setDeals(data.deals || []);
                if (data.deals && data.deals.length > 0) {
                    setShowApp(true);
                }
            }
        } catch (error) {
            console.error("Failed to fetch deals", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    const handleCreateDeal = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/deals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    amount: amount ? parseInt(amount, 10) : 0,
                    stage
                }),
            });
            if (res.ok) {
                setShowAddModal(false);
                setName("");
                setAmount("");
                setStage("New");
                setShowApp(true); // force into app view
                fetchDeals();
            }
        } catch (error) {
            console.error("Failed to create deal", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#009262]" />
            </div>
        );
    }

    if (!showApp && deals.length === 0) {
        return (
            <div className="font-sans flex flex-col xl:flex-row min-h-[calc(100vh-140px)] gap-10 xl:gap-0 relative">
                <div className="flex-1 pt-8 xl:pr-20 flex flex-col justify-center max-w-2xl mx-auto xl:mx-0">
                    <h1 className="text-[36px] sm:text-[44px] leading-tight font-bold text-[#001b12] mb-10">
                        Boost your sales efficiency<br className="hidden sm:block" /> and grow your business
                    </h1>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[18px] font-semibold text-[#4e46dc] mb-2">Create custom pipelines</h3>
                            <p className="text-[16px] text-[#4a5568] leading-relaxed">
                                Define your own pipeline stages and get a 360 view of your opportunities at any time.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[18px] font-semibold text-[#4e46dc] mb-2">Save time with automation</h3>
                            <p className="text-[16px] text-[#4a5568] leading-relaxed">
                                Minimize repetitive tasks with easy-to-set automations and get more time to close opportunities.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[18px] font-semibold text-[#4e46dc] mb-2">Never miss a follow-up</h3>
                            <p className="text-[16px] text-[#4a5568] leading-relaxed">
                                Use tasks to keep track of your sales activities with our reminder system.
                            </p>
                        </div>
                    </div>
                    <div className="mt-10">
                        <button
                            onClick={() => setShowApp(true)}
                            className="px-6 py-3 bg-[#001b12] text-white rounded-[12px] text-[16px] font-semibold hover:bg-[#1a332a] transition-colors shadow-lg"
                        >
                            Get started with Deals
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-[#e8f7ec] flex flex-col items-center justify-center p-6 sm:p-12 xl:p-16 rounded-[32px] xl:rounded-r-none xl:rounded-l-[40px] -mx-6 sm:-mx-8 xl:mx-0 xl:-mr-12">
                    <div className="w-full max-w-2xl rounded-[16px] overflow-hidden shadow-2xl border border-[#d1ebd9] bg-white relative">
                        {/* Fake Video Player Container */}
                        <div className="aspect-video bg-[#fffdfa] flex flex-col relative group cursor-pointer border-b border-[#e6e9eb]">
                            <div className="absolute inset-0 flex flex-col">
                                {/* App Mockup Background */}
                                <div className="h-10 border-b border-[#e6e9eb] px-4 flex items-center justify-between opacity-50">
                                    <span className="text-[12px] font-bold text-[#001b12]">Sales Pipeline</span>
                                    <div className="flex gap-2">
                                        <div className="w-16 h-5 bg-slate-200 rounded"></div>
                                        <div className="w-5 h-5 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex bg-slate-50 flex-1 p-3 gap-3 overflow-hidden opacity-50">
                                    <div className="w-40 bg-slate-100 rounded-md p-2"><div className="w-1/2 h-3 bg-slate-300 rounded mb-2"></div><div className="w-full h-16 bg-white rounded shadow-sm border border-slate-200"></div></div>
                                    <div className="w-40 bg-slate-100 rounded-md p-2"><div className="w-1/2 h-3 bg-slate-300 rounded mb-2"></div><div className="w-full h-16 bg-white rounded shadow-sm border border-slate-200"></div></div>
                                    <div className="w-40 bg-slate-100 rounded-md p-2"><div className="w-1/2 h-3 bg-slate-300 rounded mb-2"></div><div className="w-full h-16 bg-white rounded shadow-sm border border-slate-200"></div><div className="w-full h-16 bg-white rounded shadow-sm border border-slate-200 mt-2"></div></div>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <PlayCircle className="w-8 h-8 text-[#001b12] ml-1" />
                                </div>
                            </div>

                            {/* Video Player Controls Bar */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center gap-3 text-white">
                                <button><PlayCircle className="w-5 h-5" fill="white" stroke="black" /></button>
                                <span className="text-[13px] font-medium text-white/90">0:00 / 1:24</span>
                                <div className="flex-1 bg-white/30 h-1 rounded-full relative ml-2">
                                    <div className="absolute left-0 top-0 h-full w-0 bg-[#009262] rounded-full"></div>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow blur-[1px]"></div>
                                </div>
                                <button className="ml-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg></button>
                                <button><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg></button>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-[15px] font-medium text-[#001b12] text-center max-w-sm">
                        Discover how to easily grow your business and manage your prospects with Deals.
                    </p>
                </div>
            </div>
        );
    }

    // Main App View
    return (
        <div className="max-w-[1200px] font-sans relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-[32px] font-semibold text-[#001b12]">Deals</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors"
                >
                    <PlusCircle className="w-4 h-4" /> Create deal
                </button>
            </div>

            <div className="flex items-center gap-6 border-b border-[#e6e9eb] mb-6">
                <button className="text-[#4e46dc] font-semibold pb-3 border-b-2 border-[#4e46dc]">
                    All Deals
                </button>
                <div className="ml-auto pb-3">
                    <button className="p-1.5 border border-[#e6e9eb] rounded-full hover:bg-[#f3f4f6]">
                        <Settings className="w-5 h-5 text-[#4a5568]" />
                    </button>
                </div>
            </div>

            {/* Kanban placeholder */}
            <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[500px]">
                {stages.map((stg) => {
                    const stageDeals = deals.filter(d => d.stage === stg);
                    const totalAmount = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);

                    return (
                        <div key={stg} className="bg-[#f3f4f6] rounded-[16px] min-w-[280px] w-[280px] p-4 flex flex-col shrink-0">
                            <h3 className="font-semibold text-[#001b12] mb-1">{stg}</h3>
                            <div className="text-[13px] text-[#4a5568] mb-4 font-medium flex justify-between">
                                <span>{stageDeals.length} deals</span>
                                <span>${totalAmount.toLocaleString()}</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {stageDeals.length === 0 ? (
                                    <div className="border border-dashed border-[#d1d5db] rounded-[12px] p-4 text-center text-[#9ca3af] text-[13px]">
                                        No deals
                                    </div>
                                ) : (
                                    stageDeals.map(deal => (
                                        <div key={deal._id} className="bg-white p-4 rounded-[12px] shadow-sm border border-[#e6e9eb] cursor-pointer hover:border-[#4e46dc] transition-colors">
                                            <h4 className="font-semibold text-[#001b12] mb-1 text-[15px]">{deal.name}</h4>
                                            <div className="text-[14px] text-[#009262] font-semibold">${(deal.amount || 0).toLocaleString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Deal Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e6e9eb] flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#001b12]">Create a deal</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-[#4a5568] hover:text-[#001b12]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateDeal} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Deal Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                    placeholder="e.g. Acme Q3 Renewal"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#4a5568] mb-1">Amount ($)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                        placeholder="5000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4a5568] mb-1">Stage</label>
                                    <select
                                        value={stage}
                                        onChange={(e) => setStage(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262] bg-white"
                                    >
                                        {stages.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-[#e6e9eb] text-[#001b12] rounded-lg hover:bg-[#f3f4f6] font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-[#001b12] text-white rounded-lg hover:bg-[#1a332a] font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    Create deal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
