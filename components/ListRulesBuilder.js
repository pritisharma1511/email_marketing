"use client";

import { useState } from "react";
import { ChevronDown, PlusCircle, Loader2 } from "lucide-react";

export default function ListRulesBuilder({ list, availableLists, onSaveRules, isSaving }) {
    // Local state for the editable rules (handling a single 'memberOfList' rule for now per spec)
    const [selectedListId, setSelectedListId] = useState(() => {
        const rule = list?.rules?.find(r => r.field === 'memberOfList');
        return rule ? rule.value : "";
    });

    const handleSave = () => {
        const newRules = selectedListId ? [{ field: 'memberOfList', operator: 'equals', value: selectedListId }] : [];
        onSaveRules(newRules);
    };

    return (
        <div className="bg-[#fafafa] border border-[#e6e9eb] rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="text-[14px] font-semibold text-slate-900">Member of a list</div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-[#001b12] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a332a] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                    Save Rule
                </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center mb-6">
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e6e9eb] rounded-lg">
                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                    <span className="text-[14px] text-slate-600">Member of</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </div>

                <div className="flex-1 max-w-sm">
                    <select
                        value={selectedListId}
                        onChange={(e) => setSelectedListId(e.target.value)}
                        className="w-full px-3 py-2 bg-[#f3f4f6] text-slate-900 border border-[#e6e9eb] rounded-lg text-[14px] outline-none focus:ring-2 focus:ring-[#009262]"
                    >
                        <option value="">Select a list...</option>
                        <option value={list._id}>{list.name} #{list._id.substring(list._id.length - 4)} (Self)</option>
                        {availableLists.filter(l => l._id !== list._id).map((otherList) => (
                            <option key={otherList._id} value={otherList._id}>
                                {otherList.name} #{otherList._id.substring(otherList._id.length - 4)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e6e9eb] rounded-full text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-not-allowed opacity-60">
                <PlusCircle className="w-4 h-4" /> And
            </button>
        </div>
    );
}
