"use client";

import { useState, useEffect } from "react";
import { Settings, Search, ChevronDown, Loader2, X } from "lucide-react";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [industry, setIndustry] = useState("");
    const [employeeCount, setEmployeeCount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/companies");
            const data = await res.json();
            if (res.ok) {
                setCompanies(data.companies || []);
            }
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    domain,
                    industry,
                    employeeCount: employeeCount ? parseInt(employeeCount, 10) : null
                }),
            });
            if (res.ok) {
                setShowAddModal(false);
                setName("");
                setDomain("");
                setIndustry("");
                setEmployeeCount("");
                fetchCompanies();
            }
        } catch (error) {
            console.error("Failed to create company", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1200px] font-sans relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-[32px] font-semibold text-[#001b12]">Companies</h1>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-[#e6e9eb] rounded-[12px] text-[15px] font-semibold text-[#001b12] hover:bg-[#f3f4f6] transition-colors">
                        Import companies
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-[#001b12] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1a332a] transition-colors"
                    >
                        Create company
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6 border-b border-[#e6e9eb] mb-6">
                <button className="text-[#4e46dc] font-semibold pb-3 border-b-2 border-[#4e46dc]">
                    All companies
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

            <div className="bg-[#f3f4f6] rounded-[12px] p-2 flex items-center mb-6">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e6e9eb] rounded-full text-[14px] font-medium text-[#001b12]">
                    Add filter <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 text-[14px]">
                <div className="text-[#4a5568]">{companies.length} companies</div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button className="flex items-center gap-2 text-[#4e46dc] font-semibold hover:text-[#3b35a8]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
                        Customize columns
                    </button>
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Company name" className="w-full pl-9 pr-4 py-1.5 border border-[#e6e9eb] rounded-full text-[14px] focus:outline-none focus:ring-1 focus:ring-[#4e46dc]" />
                    </div>
                </div>
            </div>

            {/* Table or Empty State */}
            <div className="bg-white border text-[14px] border-[#e6e9eb] rounded-[16px] overflow-hidden min-h-[400px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-[#e6e9eb] bg-white">
                                <th className="py-4 pl-4 pr-2 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                                <th className="py-4 px-4 font-semibold text-[#001b12]">Company name</th>
                                <th className="py-4 px-4 font-semibold text-[#4a5568] text-[13px]">Domain</th>
                                <th className="py-4 px-4 font-semibold text-[#4a5568] text-[13px]">Industry</th>
                                <th className="py-4 px-4 font-semibold text-[#4a5568] text-[13px]">Employees</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-[#4a5568]">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#009262]" />
                                        Loading companies...
                                    </td>
                                </tr>
                            ) : companies.length > 0 ? (
                                companies.map((company) => (
                                    <tr key={company._id} className="border-b border-[#e6e9eb] hover:bg-[#f3f4f6]">
                                        <td className="py-4 pl-4 pr-2"><input type="checkbox" className="rounded border-slate-300" /></td>
                                        <td className="py-4 px-4 font-medium text-[#4e46dc] underline underline-offset-2">{company.name}</td>
                                        <td className="py-4 px-4 text-[#4a5568]">
                                            {company.domain ? <a href={company.domain.includes('http') ? company.domain : `https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#4e46dc] transition-colors">{company.domain}</a> : "-"}
                                        </td>
                                        <td className="py-4 px-4 text-[#4a5568]">{company.industry || "-"}</td>
                                        <td className="py-4 px-4 text-[#4a5568]">{company.employeeCount || "-"}</td>
                                    </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>

                    {!loading && companies.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center relative border-t border-[#e6e9eb]">
                            <h3 className="text-[16px] font-semibold text-[#001b12] mb-1">You don't have any companies yet.</h3>
                            <button onClick={() => setShowAddModal(true)} className="text-[#4e46dc] underline font-medium cursor-pointer">
                                Create your first company
                            </button>

                            <div className="mt-8 h-40 w-full max-w-lg relative overflow-hidden pointer-events-none opacity-80 flex items-end justify-center">
                                <div className="w-32 h-32 bg-[#00744e] rounded-t-full -ml-32"></div>
                                <div className="absolute right-1/4 top-4 w-12 h-12 bg-[#009262] rounded-full opacity-60"></div>
                                <div className="h-20 w-32 bg-[#f3faf6] rounded-xl border border-[#009262] ml-4 flex p-2 pt-6 items-start gap-1">
                                    <div className="w-3 h-3 rounded-full bg-[#009262] opacity-40"></div>
                                    <div className="flex-1 h-3 rounded-full bg-[#009262] opacity-40"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {companies.length > 0 && (
                    <div className="px-6 py-4 bg-white flex justify-end items-center text-[13px] text-[#4a5568] border-t border-[#e6e9eb] mt-auto">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <select className="border border-[#e6e9eb] rounded p-1 font-medium bg-transparent outline-none"><option>20</option></select>
                                <span className="font-medium">Rows per page</span>
                            </div>
                            <div className="font-medium">1-{companies.length} of {companies.length}</div>
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

            {/* Create Company Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e6e9eb] flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#001b12]">Create a company</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-[#4a5568] hover:text-[#001b12]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Company Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4a5568] mb-1">Domain</label>
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                    placeholder="acme.com"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#4a5568] mb-1">Industry</label>
                                    <input
                                        type="text"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                        placeholder="Software"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4a5568] mb-1">Employees</label>
                                    <input
                                        type="number"
                                        value={employeeCount}
                                        onChange={(e) => setEmployeeCount(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#e6e9eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009262] focus:border-[#009262]"
                                        placeholder="100"
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
                                    Create company
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
