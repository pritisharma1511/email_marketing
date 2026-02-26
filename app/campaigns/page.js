"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, ChevronDown, ChevronLeft, ChevronRight, PenTool, MoreVertical, Crown } from "lucide-react";
import { format } from "date-fns";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch("/api/campaigns");
            if (res.ok) {
                const data = await res.json();
                setCampaigns(data.campaigns || []);
            }
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCampaigns = campaigns.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="font-sans max-w-[1200px] mx-auto pb-12">
            {/* Header Tabs Navigation */}
            <div className="border-b border-slate-200 mb-6">
                <div className="flex gap-8">
                    <button className="px-6 py-3 text-[#4e46dc] font-semibold border-b-2 border-[#4e46dc] bg-[#f0f2fb] rounded-t-lg text-sm">
                        Email
                    </button>
                    {/* Placeholder tabs to match UI */}
                    <button className="px-6 py-3 text-slate-500 font-medium hover:text-slate-700 text-sm">SMS</button>
                    <button className="px-6 py-3 text-slate-500 font-medium hover:text-slate-700 text-sm">WhatsApp</button>
                    <button className="px-6 py-3 text-slate-500 font-medium hover:text-slate-700 text-sm">Push</button>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex items-center gap-4 mb-6">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#4e46dc] focus:ring-[#4e46dc]" />

                <div className="relative flex-1 max-w-sm">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for a campaign"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-[#4e46dc] focus:ring-1 focus:ring-[#4e46dc]"
                    />
                </div>

                <div className="relative">
                    <select className="appearance-none bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#4e46dc] focus:ring-1 focus:ring-[#4e46dc] cursor-pointer">
                        <option>All statuses</option>
                        <option>Draft</option>
                        <option>Ready</option>
                        <option>Sent</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                <div className="relative">
                    <select className="appearance-none bg-[#f8fafc] border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-slate-400 focus:outline-none cursor-pointer" disabled>
                        <option>Select tags</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                <div className="p-2 border border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50">
                    <Crown className="w-5 h-5 text-amber-500" />
                </div>

                <div className="flex-1"></div>

                <Link
                    href="/campaigns/create"
                    className="px-4 py-2 bg-[#001b12] text-white rounded-lg text-sm font-semibold hover:bg-[#1a332a] transition-colors"
                >
                    Create campaign
                </Link>
            </div>

            {/* Pagination / Item Count Header */}
            <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-semibold text-slate-900">
                    1-{filteredCampaigns.length} of {filteredCampaigns.length}
                </span>
                <div className="flex items-center gap-2">
                    <select className="appearance-none bg-white border border-slate-300 rounded-md px-2 py-1 text-sm font-medium text-slate-700 focus:outline-none cursor-pointer pr-6 relative">
                        <option>1</option>
                    </select>
                    <span className="text-sm text-slate-600">of 1 pages</span>
                </div>
                <div className="flex gap-1">
                    <button className="text-slate-400 hover:text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-slate-600"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Campaign Cards List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#4e46dc] animate-spin"></div></div>
                ) : filteredCampaigns.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500 font-medium">No campaigns found.</p>
                    </div>
                ) : (
                    filteredCampaigns.map((campaign, index) => (
                        <div key={campaign._id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center hover:border-slate-300 transition-colors shadow-sm">
                            <div className="pr-4">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#4e46dc] focus:ring-[#4e46dc]" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-[15px] font-bold text-slate-900 mb-1 truncate">{campaign.name}</h3>
                                <div className="flex items-center gap-2 text-[13px]">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'ready' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                        <span className="font-medium text-slate-600 capitalize">{campaign.status}</span>
                                    </div>
                                    <span className="text-slate-400">
                                        Last edited {format(new Date(campaign.updatedAt), "MMM d, yyyy h:mm a")}
                                    </span>
                                </div>
                                <div className="text-[13px] text-slate-400 mt-0.5">
                                    #{filteredCampaigns.length - index}
                                </div>
                            </div>

                            {/* Stats Columns */}
                            <div className="flex items-center gap-6 px-8 mr-12 text-[12px]">
                                <div className="flex flex-col text-left w-20">
                                    <span className="text-slate-400 font-medium mb-1">Recipients</span>
                                    <span className="font-bold text-slate-900">-</span>
                                </div>
                                <div className="flex flex-col text-left w-12">
                                    <span className="text-slate-400 font-medium mb-1">Opens</span>
                                    <span className="font-bold text-slate-900">-</span>
                                </div>
                                <div className="flex flex-col text-left w-12">
                                    <span className="text-slate-400 font-medium mb-1">Clicks</span>
                                    <span className="font-bold text-slate-900">-</span>
                                </div>
                                <div className="flex flex-col text-left w-24">
                                    <span className="text-slate-400 font-medium mb-1">Unsubscribed</span>
                                    <span className="font-bold text-slate-900">-</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pl-4">
                                <Link href={`/campaigns/${campaign._id}/edit`} className="p-2 text-[#4e46dc] hover:bg-slate-50 rounded-lg transition-colors">
                                    <PenTool className="w-[18px] h-[18px]" />
                                </Link>
                                <button className="p-2 text-[#4e46dc] hover:bg-slate-50 rounded-lg transition-colors">
                                    <MoreVertical className="w-[18px] h-[18px]" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Scroll bar indicator purely for visual match of the mockup if needed, but not functional here */}
            {filteredCampaigns.length > 0 && (
                <div className="fixed right-6 top-1/2 bottom-12 w-2 rounded-full hidden lg:block border border-transparent">
                    <div className="w-full h-32 bg-slate-400 rounded-full"></div>
                </div>
            )}
        </div>
    );
}
