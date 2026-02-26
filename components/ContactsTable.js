"use client";

import { Search, ChevronLeft, ChevronDown, Loader2, Info } from "lucide-react";
import { useState } from "react";

export default function ContactsTable({
    contacts,
    loading,
    searchTerm,
    onSearchChange,
    emptyStateMessage = "No contacts found.",
    inlineAddRow = null
}) {
    const [rowsPerPage, setRowsPerPage] = useState(20);

    return (
        <div className="flex flex-col w-full">
            {/* Controls */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1 text-[14px] text-slate-500 font-medium">
                    {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
                    <Info className="w-4 h-4 ml-1 text-slate-400 cursor-help" />
                </div>
                {onSearchChange && (
                    <div className="relative w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-[#e6e9eb] rounded-full text-[14px] focus:outline-none focus:ring-1 focus:ring-[#4e46dc]"
                        />
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border text-[14px] border-[#e6e9eb] rounded-[16px] overflow-hidden flex flex-col">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-[#e6e9eb]">
                                <th className="py-4 px-6 w-12 text-center">
                                    <input type="checkbox" className="w-[18px] h-[18px] rounded border-[#cbd5e1] text-[#4e46dc] focus:ring-[#4e46dc]" />
                                </th>
                                <th className="py-4 px-6 font-bold text-[#001b12] text-[12px] tracking-wide w-1/4">CONTACT</th>
                                <th className="py-4 px-6 font-bold text-slate-500 text-[12px] tracking-wide w-1/4">SUBSCRIBED</th>
                                <th className="py-4 px-6 font-bold text-slate-500 text-[12px] tracking-wide w-1/4">BLOCKLISTED</th>
                                <th className="py-4 px-6 font-bold text-slate-500 text-[12px] tracking-wide">EMAIL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#009262]" />
                                        Loading contacts...
                                    </td>
                                </tr>
                            ) : contacts.length === 0 ? (
                                <>
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500">
                                            {emptyStateMessage}
                                        </td>
                                    </tr>
                                    {inlineAddRow}
                                </>
                            ) : (
                                <>
                                    {contacts.map((contact) => (
                                        <tr key={contact._id} className="border-b border-[#e6e9eb] hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-4 px-6 text-center">
                                                <input type="checkbox" className="w-[18px] h-[18px] rounded border-[#cbd5e1] text-[#4e46dc] focus:ring-[#4e46dc]" />
                                            </td>
                                            <td className="py-4 px-6 font-medium">
                                                <span className="text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-500 cursor-pointer">
                                                    {contact.firstName || contact.lastName ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim() : contact.email}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {(!contact.subscribedChannels || contact.subscribedChannels.length === 0) && contact.status === 'subscribed' && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e0faee] text-[#006e4a] rounded-full text-[13px] font-medium border border-[#bbf0d8]">
                                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                                            Email
                                                        </span>
                                                    )}
                                                    {contact.subscribedChannels?.map(channel => (
                                                        <span key={channel} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e0faee] text-[#006e4a] rounded-full text-[13px] font-medium border border-[#bbf0d8] capitalize">
                                                            {channel === 'email' && <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>}
                                                            {channel === 'sms' && <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z" /></svg>}
                                                            {channel}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {contact.isBlocked ? (
                                                    <span className="text-red-500 font-medium">Yes</span>
                                                ) : contact.status === 'unsubscribed' ? (
                                                    <span className="text-slate-500 font-medium">Yes (Unsub)</span>
                                                ) : (
                                                    <span className="text-slate-500">-</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-slate-900">
                                                {contact.email}
                                            </td>
                                        </tr>
                                    ))}
                                    {inlineAddRow}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Visual Scrollbar */}
                <div className="h-2 w-full px-6 py-1 bg-white relative">
                    <div className="absolute left-6 h-1 bg-slate-400 rounded-full w-3/4"></div>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-white flex justify-end items-center text-[13px] text-[#4a5568] border-t border-[#e6e9eb] mt-auto w-full">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <select
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                className="border border-[#e6e9eb] rounded p-1 font-medium bg-transparent outline-none cursor-pointer"
                            >
                                <option>20</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                            <span className="font-medium text-slate-600">Rows per page</span>
                        </div>
                        <div className="font-semibold text-slate-800">1-{contacts.length || 1} of {contacts.length || 1}</div>
                        <div className="flex items-center gap-2">
                            <select className="border border-[#e6e9eb] rounded p-1 font-medium bg-transparent outline-none cursor-pointer"><option>1</option></select>
                            <span className="font-medium text-slate-600">of 1 pages</span>
                        </div>
                        <div className="flex gap-2 text-slate-300">
                            <ChevronLeft className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                            <ChevronLeft className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer rotate-180" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
