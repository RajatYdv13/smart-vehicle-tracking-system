import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");

    const handleLogin = (e) => {

        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        // Demo Login
        if (
            email === "admin@smartfleet.com" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    name: "Rajat Yadav",
                    role: "Administrator",
                    email: email,
                })
            );

            navigate("/dashboard");

        } else {

            setError(
                "Invalid email or password."
            );

        }
    };


    return (

        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md">


                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="mb-7 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl shadow-lg">
                        🚗
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-slate-800">
                        Smart Fleet
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Vehicle Management System
                    </p>

                </div>


                {/* ==================================================
                    LOGIN CARD
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">

                    <div className="mb-6">

                        <h2 className="text-xl font-bold text-slate-800">
                            Welcome back
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Sign in to continue to your dashboard.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>

                    )}


                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >


                        {/* EMAIL */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <label className="block text-sm font-semibold text-slate-700">
                                    Password
                                </label>


                                {/* FORGOT PASSWORD */}

                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Forgot password?
                                </Link>

                            </div>


                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-16 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            Sign In
                        </button>

                    </form>


                    {/* ==================================================
                        REGISTER
                    ================================================== */}

                    <div className="mt-6 text-center">

                        <p className="text-sm text-slate-500">

                            Don't have an account?

                            {" "}

                            <Link
                                to="/register"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Create account
                            </Link>

                        </p>

                    </div>


                    {/* ==================================================
                        DEMO LOGIN
                    ================================================== */}

                    <div className="mt-6 rounded-lg bg-slate-50 p-4">

                        <p className="text-xs font-semibold text-slate-600">
                            Demo Account
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Email: admin@smartfleet.com
                        </p>

                        <p className="text-xs text-slate-400">
                            Password: admin123
                        </p>

                    </div>

                </div>


                {/* FOOTER */}

                <p className="mt-6 text-center text-xs text-slate-400">
                    Smart Vehicle Tracking System
                </p>

            </div>

        </div>

    );
}

export default Login;