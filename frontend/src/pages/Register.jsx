import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleRegister = (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        // Demo registration
        localStorage.setItem(
            "registeredUser",
            JSON.stringify({
                name,
                email,
                password,
            })
        );


        setSuccess(
            "Account created successfully. Redirecting to login..."
        );


        setTimeout(() => {

            navigate("/login");

        }, 1500);

    };


    return (

        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">

            <div className="w-full max-w-md">


                {/* BRAND */}

                <div className="mb-7 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl shadow-lg">
                        🚗
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-slate-800">
                        Create your account
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Join Smart Fleet Management
                    </p>

                </div>


                {/* CARD */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>

                    )}


                    {success && (

                        <div className="mb-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {success}
                        </div>

                    )}


                    <form
                        onSubmit={handleRegister}
                        className="space-y-5"
                    >


                        {/* NAME */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Full name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


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

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Password
                            </label>

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
                                placeholder="Create a password"
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Confirm password
                            </label>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm your password"
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


                        {/* SHOW PASSWORD */}

                        <label className="flex cursor-pointer items-center gap-2">

                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="h-4 w-4 rounded border-slate-300"
                            />

                            <span className="text-sm text-slate-500">
                                Show password
                            </span>

                        </label>


                        {/* REGISTER */}

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            Create Account
                        </button>

                    </form>


                    {/* LOGIN */}

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                        <p className="text-sm text-slate-500">

                            Already have an account?

                            {" "}

                            <Link
                                to="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </div>


                <p className="mt-6 text-center text-xs text-slate-400">
                    Smart Vehicle Tracking System
                </p>

            </div>

        </div>

    );
}

export default Register;