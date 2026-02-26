"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Phone, Bell, ArrowRight } from "lucide-react";

export default function CampaignTypePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState('email');

    const campaignTypes = [
        { id: 'email', name: 'Email', icon: Mail, description: 'Send beautifully designed emails to your subscribers.' },
        { id: 'sms', name: 'SMS', icon: MessageSquare, description: 'Reach customers instantly with text messages.' },
        { id: 'whatsapp', name: 'WhatsApp', icon: Phone, description: 'Engage users directly via WhatsApp.' },
        { id: 'push', name: 'Push Notification', icon: Bell, description: 'Send alerts directly to user devices.' },
    ];

    const handleNext = () => {
        router.push(`/campaigns/create/basic-info?type=${selectedType}`);
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/campaigns" className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Choose Campaign Type</h1>
                    <p className="text-sm text-slate-500">What kind of campaign would you like to create?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {campaignTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                        <div
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${isSelected
                                ? 'border-[#009262] bg-[#e8f7ec] shadow-sm'
                                : 'border-[#e6e9eb] bg-white hover:border-[#b3e0cf] hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#009262] text-white' : 'bg-[#f3faf6] text-[#009262]'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${isSelected ? 'text-[#001b12]' : 'text-slate-900'}`}>
                                        {type.name}
                                    </h3>
                                    <p className={`text-sm mt-1 ${isSelected ? 'text-[#006e4a]' : 'text-slate-500'}`}>
                                        {type.description}
                                    </p>
                                    {!isSelected && type.id !== 'email' && (
                                        <span className="inline-block mt-3 text-xs font-medium px-2 py-1 rounded bg-[#f3f4f6] text-slate-500">
                                            Coming Soon
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#001b12] hover:bg-[#1a332a] gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    Continue to Basic Info
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
