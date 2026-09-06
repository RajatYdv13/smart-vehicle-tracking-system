import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {

    const [email, setEmail] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    const handleSubmit = (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!email) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        const registeredUser =
            JSON.parse(
                localStorage.getItem(
                    "registeredUser"
                )
            );


        if (
            registeredUser &&
            registeredUser.email === email
        ) {

            setMessage(
                "Password reset instructions have been sent to your email."
            );

        } else if (
            email === "admin@smartfleet.com"
        ) {

            setMessage(
                "Password reset instructions have been sent to your email."
            );

        } else {

            setError(
                "No account found with this email."
            );

        }

    };


    return (

        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md">


                {/* BRAND */}

                <div className="mb-7 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl shadow-lg">
                        🔐
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-slate-800">
                        Forgot Password?
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Reset your Smart Fleet account password.
                    </p>

                </div>


                {/* CARD */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">


                    {error && (

                        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>

                    )}


                    {message && (

                        <div className="mb-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {message}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your registered email"
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            Send Reset Instructions
                        </button>

                    </form>


                    {/* BACK */}

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                        <Link
                            to="/login"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            ← Back to Login
                        </Link>

                    </div>

                </div>


                <p className="mt-6 text-center text-xs text-slate-400">
                    Smart Vehicle Tracking System
                </p>

            </div>

        </div>

    );
}

export default ForgotPassword;