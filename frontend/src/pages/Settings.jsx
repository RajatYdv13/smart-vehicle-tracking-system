import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Settings() {

    const [notifications, setNotifications] =
        useState(true);

    const [autoRefresh, setAutoRefresh] =
        useState(true);

    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <div className="flex">

                <Sidebar />

                <main className="flex-1 p-4 md:p-6 lg:p-8">

                    <div className="mb-7">

                        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                            Settings
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your account and fleet preferences.
                        </p>

                    </div>


                    <div className="max-w-4xl space-y-6">


                        {/* ACCOUNT */}

                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 px-5 py-4">

                                <h2 className="font-bold text-slate-800">
                                    Account
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Your administrator profile
                                </p>

                            </div>


                            <div className="p-5">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                                        R
                                    </div>


                                    <div>

                                        <h3 className="font-semibold text-slate-800">
                                            Rajat Yadav
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            Administrator
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* PREFERENCES */}

                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 px-5 py-4">

                                <h2 className="font-bold text-slate-800">
                                    Preferences
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Configure dashboard behavior
                                </p>

                            </div>


                            <div className="divide-y divide-slate-100">


                                {/* NOTIFICATIONS */}

                                <div className="flex items-center justify-between gap-4 p-5">

                                    <div>

                                        <p className="font-semibold text-slate-700">
                                            Notifications
                                        </p>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Receive vehicle and GPS notifications
                                        </p>

                                    </div>


                                    <button
                                        onClick={() =>
                                            setNotifications(
                                                !notifications
                                            )
                                        }
                                        className={`relative h-6 w-11 rounded-full transition ${
                                            notifications
                                                ? "bg-blue-600"
                                                : "bg-slate-300"
                                        }`}
                                    >

                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                                                notifications
                                                    ? "left-6"
                                                    : "left-1"
                                            }`}
                                        />

                                    </button>

                                </div>


                                {/* AUTO REFRESH */}

                                <div className="flex items-center justify-between gap-4 p-5">

                                    <div>

                                        <p className="font-semibold text-slate-700">
                                            Auto Refresh
                                        </p>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Automatically refresh vehicle data
                                        </p>

                                    </div>


                                    <button
                                        onClick={() =>
                                            setAutoRefresh(
                                                !autoRefresh
                                            )
                                        }
                                        className={`relative h-6 w-11 rounded-full transition ${
                                            autoRefresh
                                                ? "bg-blue-600"
                                                : "bg-slate-300"
                                        }`}
                                    >

                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                                                autoRefresh
                                                    ? "left-6"
                                                    : "left-1"
                                            }`}
                                        />

                                    </button>

                                </div>

                            </div>

                        </section>


                        {/* SYSTEM */}

                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 px-5 py-4">

                                <h2 className="font-bold text-slate-800">
                                    System
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Smart Fleet system information
                                </p>

                            </div>


                            <div className="p-5">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">
                                        System Status
                                    </span>

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        Online
                                    </span>

                                </div>


                                <div className="mt-4 flex items-center justify-between">

                                    <span className="text-sm text-slate-500">
                                        GPS Tracking
                                    </span>

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        Active
                                    </span>

                                </div>


                                <div className="mt-4 flex items-center justify-between">

                                    <span className="text-sm text-slate-500">
                                        Auto Refresh
                                    </span>

                                    <span className="text-sm font-semibold text-slate-700">
                                        10 seconds
                                    </span>

                                </div>

                            </div>

                        </section>

                    </div>

                </main>

            </div>

        </div>

    );

}

export default Settings;