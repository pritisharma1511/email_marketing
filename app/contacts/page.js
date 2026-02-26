"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings, ChevronDown, Loader2, X } from "lucide-react";
import ContactsTable from "@/components/ContactsTable";

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    // Filtering State
    const [availableLists, setAvailableLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");

    // Dropdown UI State
    const [showListDropdown, setShowListDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Form state for creating contact
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (searchTerm) query.append('search', searchTerm);
            if (selectedListId) query.append('listId', selectedListId);
            // If API supports status filter in future
            if (statusFilter) query.append('status', statusFilter);

            const res = await fetch(`/api/contacts?${query.toString()}`);
            const data = await res.json();
            if (res.ok) {
                setContacts(data.contacts || []);
            }
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedListId, statusFilter]);

    const fetchLists = useCallback(async () => {
        try {
            const res = await fetch('/api/lists');
            if (res.ok) {
                const data = await res.json();
                setAvailableLists(data.lists || []);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
        fetchLists();
    }, [fetchContacts, fetchLists]);

    const handleAddContact = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, firstName, lastName, tags: ["new"] }),
            });
            if (res.ok) {
                setShowAddModal(false);
                setEmail("");
                setFirstName("");
                setLastName("");
                fetchContacts();
            }
        } catch (error) {
            console.error("Failed to add contact", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1200px] font-sans relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-[28px] font-semibold text-[#001b12] group relative inline-block">
                    Contacts
                    {/* Tooltip placeholder */}
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 border border-[#e6e9eb] rounded-[12px] text-[15px] font-semibold text-[#001b12] hover:bg-[#f3f4f6] transition-colors"
                    >
                        Create a contact
                    </button>
                    <button className="px-4 py-2 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors">
                        Import contacts
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-[#e6e9eb] mb-6">
                <button className="text-[#4e46dc] font-semibold pb-3 border-b-2 border-[#4e46dc]">
                    All contacts
                </button>
                <button className="text-[#4e46dc] font-semibold pb-3 hover:text-[#3b35a8]">
                    +
                </button>
                <div className="ml-auto pb-3">
                    <button className="p-1.5 border border-[#e6e9eb] rounded-full hover:bg-[#f3f4f6]">
                        <Settings className="w-5 h-5 text-[#4a5568]" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6 relative">
                {/* List Filter */}
                <div className="relative">
                    <button
                        onClick={() => setShowListDropdown(!showListDropdown)}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-[14px] font-medium transition-colors ${selectedListId ? 'bg-[#e8f7ec] text-[#006e4a] border-[#009262]' : 'border-[#e6e9eb] text-[#001b12] hover:bg-[#f3f4f6]'}`}
                    >
                        {selectedListId ? (
                            availableLists.find(l => l._id === selectedListId)?.name || 'Filtered by List'
                        ) : 'Load a list or a segment'}
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showListDropdown && (
                        <div className="absolute top-10 left-0 w-64 bg-white border border-[#e6e9eb] rounded-xl shadow-lg z-20 py-2 max-h-80 overflow-y-auto">
                            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Lists</div>
                            <button
                                onClick={() => { setSelectedListId(null); setShowListDropdown(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${!selectedListId ? 'bg-slate-50 font-semibold text-[#009262]' : 'text-slate-700'}`}
                            >
                                All Contacts
                            </button>
                            {availableLists.map(list => (
                                <button
                                    key={list._id}
                                    onClick={() => { setSelectedListId(list._id); setShowListDropdown(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${selectedListId === list._id ? 'bg-slate-50 font-semibold text-[#009262]' : 'text-slate-700'}`}
                                >
                                    {list.name} <span className="text-slate-400 text-xs ml-1">({list.contactCount})</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status/Attribute Filter */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-[14px] font-medium transition-colors ${statusFilter ? 'bg-[#e8f7ec] text-[#006e4a] border-[#009262]' : 'border-[#e6e9eb] text-[#001b12] hover:bg-[#f3f4f6]'}`}
                    >
                        {statusFilter ? `Status: ${statusFilter}` : 'Add filter'}
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showFilterDropdown && (
                        <div className="absolute top-10 left-0 w-48 bg-white border border-[#e6e9eb] rounded-xl shadow-lg z-20 py-2">
                            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</div>
                            <button onClick={() => { setStatusFilter(""); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${!statusFilter ? 'font-semibold text-[#009262]' : 'text-slate-700'}`}>Any Status</button>
                            <button onClick={() => { setStatusFilter("subscribed"); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === 'subscribed' ? 'font-semibold text-[#009262]' : 'text-slate-700'}`}>Subscribed</button>
                            <button onClick={() => { setStatusFilter("unsubscribed"); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === 'unsubscribed' ? 'font-semibold text-[#009262]' : 'text-slate-700'}`}>Unsubscribed</button>
                        </div>
                    )}
                </div>

                {(selectedListId || statusFilter) && (
                    <button
                        onClick={() => { setSelectedListId(null); setStatusFilter(""); }}
                        className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 ml-2 transition-colors"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Shared Contacts Table */}
            <ContactsTable
                contacts={contacts}
                loading={loading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                emptyStateMessage="No contacts found. Click 'Create a contact' to add one."
            />

            {/* Add Contact Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e6e9eb] flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#001b12]">Create a contact</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-[#4a5568] hover:text-[#001b12]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddContact} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#4a5568] mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4a5568] mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                        placeholder="Doe"
                                    />
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
                                    Create contact
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
