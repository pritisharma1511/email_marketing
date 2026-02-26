"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            // Simulate API call for now since we don't have actual email sending setup
            await new Promise(resolve => setTimeout(resolve, 1500));
            // To actually implement:
            // const res = await fetch("/api/auth/forgot-password", { ... });

            if (email) {
                setStatus("success");
            } else {
                throw new Error("Please enter a valid email address.");
            }
        } catch (err) {
            setStatus("error");
            setErrorMsg(err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-[#001b12] rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                        <Mail className="text-[#009262] w-6 h-6" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600 px-4">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-[#e6e9eb]">

                    {status === "success" ? (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#e8f7ec] mb-4">
                                <CheckCircle2 className="h-6 w-6 text-[#009262]" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">Check your email</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                We've sent password reset instructions to <span className="font-medium text-slate-900">{email}</span>.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/login"
                                    className="w-full flex justify-center py-2.5 px-4 border border-[#e6e9eb] rounded-lg shadow-sm text-sm font-medium text-[#001b12] bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009262] transition-colors"
                                >
                                    Return to log in
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {status === "error" && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                    <p className="text-sm text-red-700">{errorMsg}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email address</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="focus:ring-[#009262] focus:border-[#009262] block w-full pl-10 sm:text-sm border-[#e6e9eb] rounded-lg py-2.5 border outline-none transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={status === "loading" || !email}
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#001b12] hover:bg-[#1a332a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009262] transition-all disabled:opacity-70 disabled:cursor-not-allowed items-center group"
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Send reset link
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-center pt-2">
                                <Link href="/login" className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to log in
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
