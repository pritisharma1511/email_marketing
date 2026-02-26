"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit2, Loader2 } from "lucide-react";
import ContactsTable from "@/components/ContactsTable";
import ListRulesBuilder from "@/components/ListRulesBuilder";

export default function ListDetailsPage() {
    const params = useParams();
    const { id } = params;
    const router = useRouter();

    const [list, setList] = useState(null);
    const [availableLists, setAvailableLists] = useState([]);
    const [contacts, setContacts] = useState([]);

    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [isSavingRules, setIsSavingRules] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    // Inline add state
    const [inlineEmail, setInlineEmail] = useState("");
    const [isAddingInline, setIsAddingInline] = useState(false);

    const fetchAllLists = async () => {
        try {
            const res = await fetch('/api/lists');
            if (res.ok) {
                const data = await res.json();
                setAvailableLists(data.lists || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchListDetails = useCallback(async () => {
        try {
            const res = await fetch(`/api/lists/${id}`);
            if (res.ok) {
                const data = await res.json();
                setList(data.list);
            } else {
                router.push('/lists');
            }
        } catch (error) {
            console.error("Failed to fetch list details", error);
        }
    }, [id, router]);

    const fetchContacts = useCallback(async () => {
        setLoadingContacts(true);
        try {
            const query = new URLSearchParams();
            query.append('listId', id);
            if (searchTerm) query.append('search', searchTerm);

            const res = await fetch(`/api/contacts?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setContacts(data.contacts || []);
            }
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoadingContacts(false);
        }
    }, [id, searchTerm]);

    useEffect(() => {
        if (!id) return;
        const initialLoad = async () => {
            await Promise.all([fetchListDetails(), fetchAllLists()]);
            setLoadingPage(false);
        };
        initialLoad();
    }, [id, fetchListDetails]);

    // Fetch contacts whenever search term changes or page loads
    useEffect(() => {
        if (!loadingPage) {
            fetchContacts();
        }
    }, [loadingPage, searchTerm, fetchContacts]);

    const handleSaveRules = async (newRules) => {
        setIsSavingRules(true);
        try {
            const res = await fetch(`/api/lists/${id}/rules`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rules: newRules })
            });
            if (res.ok) {
                const data = await res.json();
                setList(data.list);
                fetchContacts(); // Refresh contacts based on new rules
            }
        } catch (error) {
            console.error("Failed to save rules", error);
        } finally {
            setIsSavingRules(false);
        }
    };

    const handleInlineAddContact = async (e) => {
        if (e.key === 'Enter' && inlineEmail.trim()) {
            setIsAddingInline(true);
            try {
                // 1. Create/find contact
                const contactRes = await fetch("/api/contacts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: inlineEmail.trim(), tags: ["from_list", list?.name] }),
                });

                if (contactRes.ok) {
                    const contactData = await contactRes.json();

                    // 2. Add to list manually
                    await fetch(`/api/lists/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: 'add_contact', contactId: contactData.contact._id }),
                    });
                }
            } catch (error) {
                console.error("Failed to add contact", error);
            } finally {
                setInlineEmail("");
                setIsAddingInline(false);
                fetchContacts();
            }
        }
    };

    if (loadingPage) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#009262]" />
            </div>
        );
    }

    if (!list) return null;

    const inlineAddRow = (
        <tr className="border-b border-[#e6e9eb] hover:bg-[#f8fafc] transition-colors bg-white">
            <td className="py-4 px-6 text-center">
                <input type="checkbox" className="w-[18px] h-[18px] rounded border-[#cbd5e1] text-[#4e46dc] focus:ring-[#4e46dc]" disabled />
            </td>
            <td className="py-4 px-6 font-medium">
                <input
                    type="email"
                    placeholder="Enter contact email and hit Enter..."
                    className="w-full text-[14px] bg-transparent focus:outline-none placeholder:text-slate-400 text-slate-900 underline underline-offset-4 decoration-slate-300"
                    value={inlineEmail}
                    onChange={(e) => setInlineEmail(e.target.value)}
                    onKeyDown={handleInlineAddContact}
                    disabled={isAddingInline}
                />
            </td>
            <td className="py-4 px-6 text-slate-400 text-[13px]">-</td>
            <td className="py-4 px-6 text-slate-400 text-[13px]">-</td>
            <td className="py-4 px-6 text-slate-400 text-[13px]">-</td>
        </tr>
    );

    return (
        <div className="font-sans max-w-[1200px] mx-auto pb-12">
            {/* Breadcrumb Header */}
            <div className="flex items-center text-[14px] text-slate-500 mb-6">
                <Link href="/lists" className="hover:text-slate-900 transition-colors">Lists</Link>
                <span className="mx-2">/</span>
                <span className="text-slate-900 font-medium">{list.name}</span>
            </div>

            {/* Title Section */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/lists" className="p-1 hover:bg-slate-100 rounded text-[#4e46dc] transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[28px] font-semibold text-[#001b12] flex items-center gap-3">
                            {list.name}
                            <button className="text-[#4e46dc] p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                <Edit2 className="w-[18px] h-[18px]" />
                            </button>
                        </h1>
                        {list.description && <p className="text-slate-500 text-sm mt-1">{list.description}</p>}
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/contacts" className="px-4 py-2 border border-[#e6e9eb] rounded-[12px] text-[15px] font-semibold text-[#001b12] hover:bg-[#f3f4f6] transition-colors">
                        Go to Contacts
                    </Link>
                </div>
            </div>

            {/* Rule Builder */}
            <ListRulesBuilder
                list={list}
                availableLists={availableLists}
                onSaveRules={handleSaveRules}
                isSaving={isSavingRules}
            />

            {/* Shared Contacts Table */}
            <ContactsTable
                contacts={contacts}
                loading={loadingContacts}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                emptyStateMessage="No contacts in this list yet."
                inlineAddRow={inlineAddRow}
            />
        </div>
    );
}
