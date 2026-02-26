"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Save, Loader2, Code } from "lucide-react";

export default function NewCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        fromName: "",
        fromEmail: "",
        htmlContent: "<h1>Hello {{firstName}},</h1><p>Welcome to our newsletter!</p>",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveDraft = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/campaigns");
            }
        } catch (error) {
            console.error("Failed to save draft", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/campaigns" className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create Campaign</h1>
                        <p className="text-sm text-slate-500">Draft your new email newsletter</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSaveDraft}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 gap-2 transition-colors disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Draft
                    </button>
                    <button
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 gap-2 transition-colors disabled:opacity-70"
                    >
                        <Send className="w-4 h-4" />
                        Next: Select Audience
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="p-6 space-y-8">

                    {/* Header Details */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Campaign Settings</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Internal Campaign Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                placeholder="e.g. October Product Update"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Subject Line</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                placeholder="Check out our new features!"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sender Name</label>
                                <input
                                    type="text"
                                    name="fromName"
                                    value={formData.fromName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                    placeholder="Acme Inc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sender Email</label>
                                <input
                                    type="email"
                                    name="fromEmail"
                                    value={formData.fromEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                    placeholder="hello@acme.com"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Email Body Editor */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-lg font-semibold text-slate-900">Email Body</h3>
                            <div className="text-sm font-medium text-slate-500 flex items-center gap-1">
                                <Code className="w-4 h-4" />
                                Raw HTML
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500">
                            <textarea
                                name="htmlContent"
                                value={formData.htmlContent}
                                onChange={handleChange}
                                className="w-full h-64 p-4 bg-transparent text-slate-100 font-mono text-sm focus:outline-none resize-y"
                                placeholder="<html>...</html>"
                            />
                        </div>
                        <p className="text-xs text-slate-500 text-right">Preview mode available in next step</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
