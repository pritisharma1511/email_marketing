"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Send, Users, PenTool, LayoutTemplate, Plus, Check } from "lucide-react";
import { use } from "react"; // For unwrap

export default function EditCampaignPage({ params }) {
    const router = useRouter();
    // Unwrap the params promise using React.use
    const resolvedParams = use(params);
    const campaignId = resolvedParams.id;

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [senders, setSenders] = useState([]);
    const [showSenderModal, setShowSenderModal] = useState(false);
    const [newSender, setNewSender] = useState({ name: '', email: '', replyTo: '' });

    // Lists data
    const [lists, setLists] = useState([]);

    // Builder state
    const [formData, setFormData] = useState({
        senderId: "",
        listId: "",
        subject: "",
        previewText: "",
        htmlContent: "<html>\n  <head></head>\n  <body style=\"font-family: sans-serif; padding: 20px;\">\n    <h1>Hello!</h1>\n    <p>We have some exciting news to share...</p>\n  </body>\n</html>",
    });

    useEffect(() => {
        fetchCampaign();
        fetchSenders();
        fetchLists();
    }, [campaignId]);

    const fetchCampaign = async () => {
        try {
            const res = await fetch(`/api/campaigns/${campaignId}`);
            if (res.ok) {
                const data = await res.json();
                setCampaign(data.campaign);
                setFormData({
                    senderId: data.campaign.senderId?._id || "",
                    subject: data.campaign.subject || "",
                    previewText: data.campaign.previewText || "",
                    listId: data.campaign.audience?.listIds?.[0]?._id || "",
                    htmlContent: data.campaign.htmlContent || formData.htmlContent,
                });
            } else {
                router.push('/campaigns');
            }
        } catch (error) {
            console.error("Failed to fetch campaign", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSenders = async () => {
        try {
            const res = await fetch("/api/senders");
            if (res.ok) {
                const data = await res.json();
                setSenders(data.senders || []);
            }
        } catch (error) {
            console.error("Failed to fetch senders", error);
        }
    };

    const fetchLists = async () => {
        try {
            const res = await fetch("/api/lists");
            if (res.ok) {
                const data = await res.json();
                setLists(data.lists || []);
            }
        } catch (error) {
            console.error("Failed to fetch lists:", error);
        }
    };

    const handleCreateSender = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/senders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSender),
            });
            if (res.ok) {
                const data = await res.json();
                setSenders([data.sender, ...senders]);
                setFormData({ ...formData, senderId: data.sender._id });
                setShowSenderModal(false);
                setNewSender({ name: '', email: '', replyTo: '' });
            }
        } catch (error) {
            console.error("Failed to create sender", error);
        }
    };

    const handleSave = async (status = null) => {
        setSaving(true);
        try {
            const payload = { ...formData };
            if (status) payload.status = status;

            // Map the selected listId correctly for the backend
            if (payload.listId) {
                payload.listIds = [payload.listId];
            } else {
                payload.listIds = [];
            }
            delete payload.listId;

            const res = await fetch(`/api/campaigns/${campaignId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                if (status === 'ready') {
                    router.push('/campaigns');
                } else {
                    // Just saved draft
                    const data = await res.json();
                    setCampaign(data.campaign);
                }
            }
        } catch (error) {
            console.error("Failed to save campaign", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#009262]" /></div>;
    if (!campaign) return null;

    const isEmail = campaign.type === 'email';

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/campaigns" className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium px-2 py-0.5 rounded bg-[#e8f7ec] text-[#006e4a] border border-[#b3e0cf] capitalize">{campaign.type} Campaign</span>
                            <span className="text-sm text-slate-500">
                                {campaign.status === 'draft' ? 'Editing Draft' : `Status: ${campaign.status}`}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-[#e6e9eb] shadow-sm text-sm font-medium rounded-lg text-[#001b12] bg-white hover:bg-slate-50 gap-2 transition-colors disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Details
                    </button>
                    <button
                        onClick={() => handleSave('ready')}
                        disabled={saving || !formData.subject || !formData.senderId || !formData.listId}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#001b12] hover:bg-[#1a332a] gap-2 transition-colors disabled:opacity-70"
                    >
                        <Check className="w-4 h-4" />
                        Mark as Ready
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Forms */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Sender Section */}
                    {isEmail && (
                        <div className="bg-white rounded-xl shadow-sm border border-[#e6e9eb] p-5">
                            <div className="flex items-center gap-2 mb-4 text-[#001b12] font-semibold border-b border-slate-100 pb-2">
                                <Users className="w-5 h-5 text-[#009262]" />
                                Sender Details
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Sender</label>
                                    <select
                                        value={formData.senderId}
                                        onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] text-sm text-slate-900"
                                    >
                                        <option value="">Choose a sender...</option>
                                        {senders.map(s => (
                                            <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => setShowSenderModal(true)}
                                    className="text-sm text-[#009262] font-medium hover:text-[#006e4a] flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add New Sender
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Recipients Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#e6e9eb] p-5">
                        <div className="flex items-center gap-2 mb-4 text-[#001b12] font-semibold border-b border-slate-100 pb-2">
                            <Users className="w-5 h-5 text-[#009262]" />
                            Select Recipients
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Send to List</label>
                                <select
                                    value={formData.listId}
                                    onChange={(e) => setFormData({ ...formData, listId: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] text-sm text-slate-900"
                                >
                                    <option value="">Choose a list...</option>
                                    {lists.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.contactCount} contacts)</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#e6e9eb] p-5">
                        <div className="flex items-center gap-2 mb-4 text-[#001b12] font-semibold border-b border-slate-100 pb-2">
                            <PenTool className="w-5 h-5 text-[#009262]" />
                            Content Header
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Line</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] text-sm text-slate-900"
                                    placeholder="e.g. Big news inside!"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Preview Text / Preheader</label>
                                <input
                                    type="text"
                                    value={formData.previewText}
                                    onChange={(e) => setFormData({ ...formData, previewText: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] text-sm text-slate-900"
                                    placeholder="Snippet seen in inbox..."
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Editor/Preview */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Design Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#e6e9eb] overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-[#e6e9eb] bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-2 font-semibold text-[#001b12]">
                                <LayoutTemplate className="w-5 h-5 text-[#009262]" />
                                Email Design
                            </div>
                            <div className="flex bg-white rounded-lg border border-[#e6e9eb] overflow-hidden text-sm font-medium">
                                <button className="px-3 py-1.5 bg-[#e8f7ec] text-[#006e4a]">HTML Editor</button>
                                <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50">Visual Builder</button>
                            </div>
                        </div>

                        <div className="flex-1 p-4 bg-[#001b12] focus-within:ring-2 ring-inset ring-[#009262]">
                            <textarea
                                value={formData.htmlContent}
                                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                                className="w-full h-full bg-transparent text-[#e8f7ec] font-mono text-sm focus:outline-none resize-none"
                                placeholder="<html>...</html>"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sender Modal Overlay */}
            {showSenderModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
                        <h3 className="text-xl font-semibold mb-4 text-slate-900">Add New Sender</h3>
                        <form onSubmit={handleCreateSender} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sender Name (From)</label>
                                <input
                                    type="text"
                                    required
                                    value={newSender.name}
                                    onChange={(e) => setNewSender({ ...newSender, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sender Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newSender.email}
                                    onChange={(e) => setNewSender({ ...newSender, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reply-To Email (Optional)</label>
                                <input
                                    type="email"
                                    value={newSender.replyTo}
                                    onChange={(e) => setNewSender({ ...newSender, replyTo: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] text-slate-900"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSenderModal(false)}
                                    className="px-4 py-2 border border-[#e6e9eb] shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newSender.name || !newSender.email}
                                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#001b12] hover:bg-[#1a332a] disabled:opacity-70"
                                >
                                    Save Sender
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
