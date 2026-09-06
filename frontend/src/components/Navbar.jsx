import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const [showProfile, setShowProfile] =
        useState(false);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);


    // ======================================================
    // NOTIFICATIONS
    // ======================================================

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Vehicle is moving",
            message: "Vehicle BR01XX9999 is currently moving at 40 km/h.",
            time: "Just now",
            type: "vehicle",
            read: false,
        },
        {
            id: 2,
            title: "GPS location updated",
            message: "Latest GPS location has been received successfully.",
            time: "5 min ago",
            type: "gps",
            read: false,
        },
        {
            id: 3,
            title: "Fleet system online",
            message: "Smart Fleet tracking system is running normally.",
            time: "10 min ago",
            type: "system",
            read: false,
        },
    ]);


    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;


    // ======================================================
    // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    // ======================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowProfile(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // ======================================================
    // MARK SINGLE NOTIFICATION AS READ
    // ======================================================

    const markAsRead = (id) => {

        setNotifications((previous) =>
            previous.map((notification) =>
                notification.id === id
                    ? {
                        ...notification,
                        read: true,
                    }
                    : notification
            )
        );

    };


    // ======================================================
    // MARK ALL AS READ
    // ======================================================

    const markAllAsRead = () => {

        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                read: true,
            }))
        );

    };


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "isLoggedIn"
        );

        localStorage.removeItem(
            "user"
        );

        setShowProfile(false);

        navigate("/login");

    };


    return (

        <header className="sticky top-0 z-50 h-16 border-b border-gray-200 bg-white">

            <div className="flex h-full items-center justify-between px-4 md:px-6">


                {/* ==================================================
                    BRAND
                ================================================== */}

                <Link
                    to="/dashboard"
                    className="flex items-center gap-3"
                >

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm">

                        <span className="text-xl">
                            🚗
                        </span>

                    </div>


                    <div>

                        <h1 className="font-bold leading-tight text-gray-900">
                            Smart Fleet
                        </h1>

                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                            Vehicle Management
                        </p>

                    </div>

                </Link>


                {/* ==================================================
                    RIGHT SIDE
                ================================================== */}

                <div className="flex items-center gap-2 md:gap-5">


                    {/* ==================================================
                        SYSTEM STATUS
                    ================================================== */}

                    <div className="hidden items-center gap-2 md:flex">

                        <span className="relative flex h-2.5 w-2.5">

                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75">
                            </span>

                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500">
                            </span>

                        </span>

                        <span className="text-sm font-medium text-gray-600">
                            System Online
                        </span>

                    </div>


                    {/* ==================================================
                        NOTIFICATION
                    ================================================== */}

                    <div
                        ref={notificationRef}
                        className="relative"
                    >

                        <button
                            onClick={() => {

                                setShowNotifications(
                                    !showNotifications
                                );

                                setShowProfile(false);

                            }}
                            className="relative flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-100"
                        >

                            <span className="text-xl">
                                🔔
                            </span>


                            {unreadCount > 0 && (

                                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">

                                    {unreadCount}

                                </span>

                            )}

                        </button>


                        {/* ==================================================
                            NOTIFICATION DROPDOWN
                        ================================================== */}

                        {showNotifications && (

                            <div className="absolute right-0 mt-2 w-[350px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">

                                {/* HEADER */}

                                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

                                    <div>

                                        <h3 className="font-bold text-gray-800">
                                            Notifications
                                        </h3>

                                        <p className="text-xs text-gray-400">
                                            {unreadCount} unread
                                        </p>

                                    </div>


                                    {unreadCount > 0 && (

                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            Mark all as read
                                        </button>

                                    )}

                                </div>


                                {/* NOTIFICATION LIST */}

                                <div className="max-h-[360px] overflow-y-auto">

                                    {notifications.length === 0 ? (

                                        <div className="px-4 py-10 text-center">

                                            <div className="text-3xl">
                                                🔕
                                            </div>

                                            <p className="mt-2 text-sm font-medium text-gray-600">
                                                No notifications
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                You're all caught up.
                                            </p>

                                        </div>

                                    ) : (

                                        notifications.map(
                                            (notification) => (

                                                <button
                                                    key={notification.id}
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                    className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                                                        notification.read
                                                            ? "bg-white"
                                                            : "bg-blue-50/50"
                                                    }`}
                                                >

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm">

                                                        {notification.type ===
                                                        "vehicle"
                                                            ? "🚗"
                                                            : notification.type ===
                                                            "gps"
                                                                ? "📍"
                                                                : "✓"}

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex items-start justify-between gap-2">

                                                            <p className="text-sm font-semibold text-gray-800">

                                                                {
                                                                    notification.title
                                                                }

                                                            </p>


                                                            {!notification.read && (

                                                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600">
                                                                </span>

                                                            )}

                                                        </div>


                                                        <p className="mt-1 text-xs leading-5 text-gray-500">

                                                            {
                                                                notification.message
                                                            }

                                                        </p>


                                                        <p className="mt-1 text-[10px] text-gray-400">

                                                            {
                                                                notification.time
                                                            }

                                                        </p>

                                                    </div>

                                                </button>

                                            )
                                        )

                                    )}

                                </div>


                                {/* FOOTER */}

                                <div className="border-t border-gray-100 px-4 py-3">

                                    <button
                                        onClick={() =>
                                            setShowNotifications(false)
                                        }
                                        className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        DIVIDER
                    ================================================== */}

                    <div className="hidden h-8 w-px bg-gray-200 md:block">
                    </div>


                    {/* ==================================================
                        USER
                    ================================================== */}

                    <div
                        ref={profileRef}
                        className="relative"
                    >

                        <button
                            onClick={() => {

                                setShowProfile(
                                    !showProfile
                                );

                                setShowNotifications(false);

                            }}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-50 md:gap-3"
                        >

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                                R
                            </div>


                            <div className="hidden text-left md:block">

                                <p className="text-sm font-semibold text-gray-800">
                                    Rajat Yadav
                                </p>

                                <p className="text-xs text-gray-400">
                                    Administrator
                                </p>

                            </div>


                            <span className="text-xs text-gray-400">
                                ▼
                            </span>

                        </button>


                        {/* ==================================================
                            PROFILE MENU
                        ================================================== */}

                        {showProfile && (

                            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                                <div className="border-b border-gray-100 p-4">

                                    <p className="font-semibold text-gray-800">
                                        Rajat Yadav
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Administrator
                                    </p>

                                </div>


                                <Link
                                    to="/settings"
                                    onClick={() =>
                                        setShowProfile(false)
                                    }
                                    className="block px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-50"
                                >
                                    ⚙️ Settings
                                </Link>


                                <button
                                    onClick={handleLogout}
                                    className="w-full border-t border-gray-100 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                                >
                                    🚪 Logout
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Navbar;