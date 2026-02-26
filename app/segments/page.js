"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, PlusCircle, Loader2, X } from "lucide-react";

export default function SegmentsPage() {
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchSegments = async () => {
        try {
            const res = await fetch("/api/segments");
            const data = await res.json();
            if (res.ok) {
                setSegments(data.segments || []);
            }
        } catch (error) {
            console.error("Failed to fetch segments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSegments();
    }, []);

    const handleCreateSegment = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/segments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                setShowAddModal(false);
                setName("");
                fetchSegments();
            }
        } catch (error) {
            console.error("Failed to create segment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1200px] font-sans relative">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-[32px] font-semibold text-[#001b12]">Segments</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors"
                >
                    <PlusCircle className="w-4 h-4" /> Create a segment
                </button>
            </div>

            <p className="text-[15px] text-[#4a5568] mb-4">
                This is where you organize your segments. Create, modify, and manage segments for targeted interactions, and keep them in folders for easy navigation.
            </p>
            <div className="flex gap-6 mb-8 text-[14px] font-medium">
                <a href="#" className="flex items-center gap-1 text-[#4a5568] underline decoration-slate-300 underline-offset-4">Understanding filters and segmentation <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg></a>
                <a href="#" className="flex items-center gap-1 text-[#4a5568] underline decoration-slate-300 underline-offset-4">Differences between Lists and Segments <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg></a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search a segment name or ID" className="w-full pl-9 pr-4 py-2 border border-[#e6e9eb] rounded-full text-[14px] focus:outline-none focus:ring-1 focus:ring-[#4e46dc]" />
                </div>
                <button className="flex justify-between items-center w-56 px-4 py-2 border border-[#e6e9eb] rounded-full text-[14px] bg-white text-[#001b12] font-medium">
                    All folders ({segments.length} segments) <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            {/* Table or Empty State */}
            <div className="bg-white border text-[14px] border-[#e6e9eb] rounded-[16px] overflow-hidden min-h-[400px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-[#e6e9eb] bg-white">
                                <th className="py-4 px-6 font-semibold text-[#001b12]">Segment</th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">ID</th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">Folder</th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">Contacts</th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">
                                    <div className="flex items-center gap-1">
                                        Last edit <svg className="w-3 h-3 text-[#001b12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                                    </div>
                                </th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-[#4a5568]">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#009262]" />
                                        Loading segments...
                                    </td>
                                </tr>
                            ) : segments.length > 0 ? (
                                segments.map((segment) => (
                                    <tr key={segment._id} className="border-b border-[#e6e9eb] hover:bg-[#f3f4f6]">
                                        <td className="py-4 px-6 font-medium text-[#4e46dc] underline underline-offset-2">{segment.name}</td>
                                        <td className="py-4 px-6 text-[#4a5568]">#{segment._id.substring(segment._id.length - 4)}</td>
                                        <td className="py-4 px-6 text-[#4a5568]">-</td>
                                        <td className="py-4 px-6 text-[#4a5568]">{segment.contactIds?.length || 0}</td>
                                        <td className="py-4 px-6 text-[#4a5568]">{new Date(segment.updatedAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 text-[#4e46dc]">
                                            <svg className="w-5 h-5 cursor-pointer hover:bg-[#e6e9eb] p-0.5 rounded" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                        </td>
                                    </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>

                    {/* Empty state embedded when array is empty */}
                    {!loading && segments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-64 h-40 bg-[#f3faf6] rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-[#e8f7ec]">
                                <div className="absolute bottom-0 w-full h-1/2 bg-[#e8f7ec] rounded-t-full opacity-50"></div>
                                <div className="w-16 h-16 bg-[#009262] rounded-full absolute left-8 top-8 opacity-20"></div>
                                <div className="w-12 h-12 bg-[#009262] rounded-full absolute right-12 top-4"></div>
                                <div className="relative z-10 text-[#009262]">
                                    <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor"><path d="M50 80c-15 0-20-10-20-10s5 15 20 15 20-15 20-15-5 10-20 10zM50 40c-10 0-15-15-15-15s10 5 15 5 15-5 15-5-5 15-15 15z" /></svg>
                                </div>
                            </div>
                            <h2 className="text-[20px] font-semibold text-[#001b12] mb-2">You don't have segments in this folder yet</h2>
                        </div>
                    )}
                </div>

                {segments.length > 0 && (
                    <div className="px-6 py-4 bg-white flex justify-end items-center text-[13px] text-[#4a5568] border-t border-[#e6e9eb] mt-auto">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <select className="border border-[#e6e9eb] rounded p-1 font-medium bg-transparent outline-none"><option>20</option></select>
                                <span className="font-medium">Rows per page</span>
                            </div>
                            <div className="font-medium">1-{segments.length} of {segments.length}</div>
                            <div className="flex items-center gap-2">
                                <select className="border border-[#e6e9eb] rounded p-1 font-medium bg-transparent outline-none"><option>1</option></select>
                                <span className="font-medium">of 1 pages</span>
                            </div>
                            <div className="flex gap-2 text-slate-300">
                                <ChevronDown className="w-4 h-4 rotate-90" />
                                <ChevronDown className="w-4 h-4 -rotate-90 text-[#4e46dc]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Segment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e6e9eb] flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#001b12]">Create a new segment</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-[#4a5568] hover:text-[#001b12]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSegment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Segment Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                    placeholder="e.g. Active Users"
                                />
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
                                    Create segment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
