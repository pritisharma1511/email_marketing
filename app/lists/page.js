"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, PlusCircle, Loader2, X } from "lucide-react";

export default function ListsPage() {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [folderName, setFolderName] = useState("Your First Folder");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableContacts, setAvailableContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);

    const fetchLists = async () => {
        try {
            const res = await fetch("/api/lists");
            const data = await res.json();
            if (res.ok) {
                setLists(data.lists || []);
            }
        } catch (error) {
            console.error("Failed to fetch lists", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = async () => {
        try {
            const res = await fetch("/api/contacts");
            if (res.ok) {
                const data = await res.json();
                setAvailableContacts(data.contacts || []);
            }
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        }
    };

    useEffect(() => {
        fetchLists();
        fetchContacts();
    }, []);

    const handleCreateList = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/lists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, folderName, contactIds: selectedContacts }),
            });
            if (res.ok) {
                setShowAddModal(false);
                setName("");
                setDescription("");
                setSelectedContacts([]);
                fetchLists();
            }
        } catch (error) {
            console.error("Failed to create list", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1200px] font-sans relative">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-[32px] font-semibold text-[#001b12]">Lists</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors"
                >
                    <PlusCircle className="w-4 h-4" /> Create a list
                </button>
            </div>

            <p className="text-[15px] text-[#4a5568] mb-4">
                This is where you organize your lists. Create, modify, and manage custom lists for targeted interactions, and keep them in folders for easy navigation.
            </p>
            <div className="flex gap-6 mb-8 text-[14px] font-medium">
                <a href="#" className="flex items-center gap-1 text-[#4a5568] underline decoration-slate-300 underline-offset-4">Get started with Lists and Folders <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg></a>
                <a href="#" className="flex items-center gap-1 text-[#4a5568] underline decoration-slate-300 underline-offset-4">Lists vs Segments <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg></a>
                <a href="#" className="ml-auto text-[#4e46dc] hover:text-[#3b35a8]">Recalculate now</a>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <button className="flex justify-between items-center w-64 px-3 py-2 border border-[#e6e9eb] rounded-[8px] text-[14px] bg-white text-[#001b12] font-medium">
                    All folders ({lists.length} lists) <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search a list name or ID" className="w-full pl-9 pr-4 py-2 border border-[#e6e9eb] rounded-full text-[14px] focus:outline-none focus:ring-1 focus:ring-[#4e46dc]" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border text-[14px] border-[#e6e9eb] rounded-[16px] overflow-hidden min-h-[400px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-[#e6e9eb]">
                                <th className="py-4 px-6 font-semibold text-[#001b12]">Lists</th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">ID</th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">Folder</th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">Contacts</th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        Creation date <svg className="w-3 h-3 text-[#001b12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                                    </div>
                                </th>
                                <th className="py-4 px-6 font-semibold text-[#4a5568] text-[13px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-[#4a5568]">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#009262]" />
                                        Loading lists...
                                    </td>
                                </tr>
                            ) : lists.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-[#4a5568]">
                                        No lists found. Click "Create a list" to get started.
                                    </td>
                                </tr>
                            ) : (
                                lists.map((list) => (
                                    <tr key={list._id} className="border-b border-[#e6e9eb] hover:bg-[#f3f4f6]">
                                        <td className="py-4 px-6 font-medium text-[#4e46dc]">
                                            <Link href={`/lists/${list._id}`} className="hover:underline underline-offset-2">
                                                {list.name}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6 text-[#4a5568]">#{list._id.substring(list._id.length - 4)}</td>
                                        <td className="py-4 px-6 text-[#4a5568]">{list.folderName}</td>
                                        <td className="py-4 px-6 text-[#4a5568]">{list.contactCount || 0}</td>
                                        <td className="py-4 px-6 text-[#4a5568]">{new Date(list.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 text-[#4e46dc]">
                                            <svg className="w-5 h-5 cursor-pointer hover:bg-[#e6e9eb] p-0.5 rounded" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-white flex justify-end items-center text-[13px] text-[#4a5568] border-t border-[#e6e9eb] mt-auto">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <select className="border border-[#e6e9eb] rounded p-1 font-medium bg-transparent outline-none"><option>20</option></select>
                            <span className="font-medium">Rows per page</span>
                        </div>
                        <div className="font-medium">1-{lists.length || 1} of {lists.length || 1}</div>
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
            </div>

            {/* Create List Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e6e9eb] flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#001b12]">Create a new list</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-[#4a5568] hover:text-[#001b12]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateList} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                    placeholder="e.g. VIP Customers"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Description (Optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262] resize-none h-20"
                                    placeholder="What is this list for?"
                                    maxLength={250}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Folder</label>
                                <input
                                    type="text"
                                    value={folderName}
                                    onChange={(e) => setFolderName(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                    placeholder="Your First Folder"
                                />
                            </div>

                            {/* Contact Selection */}
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Add Contacts (Optional)</label>
                                <div className="border border-[#e6e9eb] rounded-lg max-h-48 overflow-y-auto p-2 space-y-2 bg-slate-50">
                                    {availableContacts.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-4">No contacts available to add.</p>
                                    ) : (
                                        availableContacts.map(contact => (
                                            <label key={contact._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-300 text-[#009262] focus:ring-[#009262]"
                                                    checked={selectedContacts.includes(contact._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedContacts([...selectedContacts, contact._id]);
                                                        } else {
                                                            setSelectedContacts(selectedContacts.filter(id => id !== contact._id));
                                                        }
                                                    }}
                                                />
                                                <span className="text-sm text-slate-700">
                                                    {contact.firstName ? `${contact.firstName} ${contact.lastName || ''}` : contact.email}
                                                </span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{selectedContacts.length} selected</p>
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
                                    Create list
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
