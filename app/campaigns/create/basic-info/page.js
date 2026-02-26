"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Plus, X } from "lucide-react";

function BasicInfoContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'email';

    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState([]);
    const [isLoadingFolders, setIsLoadingFolders] = useState(true);
    const [lists, setLists] = useState([]);
    const [isLoadingLists, setIsLoadingLists] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        folderId: "",
        listId: "",
    });

    // Tag management
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    // Inline Folder Creation
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    useEffect(() => {
        fetchFolders();
        fetchLists();
    }, []);

    const fetchFolders = async () => {
        setIsLoadingFolders(true);
        try {
            const res = await fetch("/api/folders");
            if (res.ok) {
                const data = await res.json();
                setFolders(data.folders || []);
            }
        } catch (error) {
            console.error("Failed to fetch folders:", error);
        } finally {
            setIsLoadingFolders(false);
        }
    };

    const fetchLists = async () => {
        setIsLoadingLists(true);
        try {
            const res = await fetch("/api/lists");
            if (res.ok) {
                const data = await res.json();
                setLists(data.lists || []);
            }
        } catch (error) {
            console.error("Failed to fetch lists:", error);
        } finally {
            setIsLoadingLists(false);
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        try {
            const res = await fetch("/api/folders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newFolderName }),
            });
            if (res.ok) {
                const data = await res.json();
                setFolders((prev) => [...prev, data.folder].sort((a, b) => a.name.localeCompare(b.name)));
                setFormData((prev) => ({ ...prev, folderId: data.folder._id }));
                setIsCreatingFolder(false);
                setNewFolderName("");
            }
        } catch (error) {
            console.error("Failed to create folder:", error);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                type,
                tags,
            };

            if (formData.listId) {
                payload.listIds = [formData.listId];
            }

            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/campaigns/${data.campaign._id}/edit`);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Failed to create draft", error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/campaigns/create" className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Campaign Details</h1>
                    <p className="text-sm text-slate-500">Step 1: Set up basic information for your {type} campaign</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Campaign Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:bg-white transition-colors text-slate-900"
                            placeholder="e.g. Q4 Newsletter"
                        />
                        <p className="mt-1 text-xs text-slate-500">This is for internal use only.</p>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700">Folder</label>
                            {!isCreatingFolder && (
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingFolder(true)}
                                    className="text-xs font-medium text-[#009262] hover:text-[#006e4a] flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> New Folder
                                </button>
                            )}
                        </div>

                        {isCreatingFolder ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:bg-white text-sm text-slate-900"
                                    placeholder="Folder Name"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateFolder}
                                    className="px-4 py-2 bg-[#001b12] text-white rounded-lg text-sm font-medium hover:bg-[#1a332a] transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsCreatingFolder(false); setNewFolderName(''); }}
                                    className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <select
                                value={formData.folderId}
                                onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:bg-white transition-colors disabled:opacity-50 text-slate-900"
                                disabled={isLoadingFolders}
                            >
                                <option value="">No Folder</option>
                                {folders.map((folder) => (
                                    <option key={folder._id} value={folder._id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Recipients (List)
                        </label>
                        <select
                            value={formData.listId}
                            onChange={(e) => setFormData({ ...formData, listId: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:bg-white transition-colors disabled:opacity-50 text-slate-900"
                            disabled={isLoadingLists}
                        >
                            <option value="">Do not select recipients yet</option>
                            {lists.map((list) => (
                                <option key={list._id} value={list._id}>
                                    {list.name} ({list.contactCount} contacts)
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-slate-500">You can also configure this later in the campaign builder.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Optional)</label>
                        <div className="w-full bg-slate-50 border border-[#e6e9eb] rounded-lg p-2 focus-within:ring-2 focus-within:ring-[#009262] focus-within:bg-white transition-colors flex flex-wrap gap-2 items-center">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#e8f7ec] text-[#006e4a] border border-[#b3e0cf] text-xs font-medium">
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-[#001b12]">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="flex-1 bg-transparent min-w-[120px] text-sm focus:outline-none text-slate-900"
                                placeholder={tags.length === 0 ? "Type and press Enter to add tags" : ""}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 flex justify-end border-t border-[#e6e9eb]">
                    <button
                        type="submit"
                        disabled={loading || !formData.name}
                        className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#001b12] hover:bg-[#1a332a] gap-2 transition-colors disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Draft & Continue'}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function BasicInfoPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
            <BasicInfoContent />
        </Suspense>
    );
}
