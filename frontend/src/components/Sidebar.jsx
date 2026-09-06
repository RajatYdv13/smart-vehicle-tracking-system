import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "📊",
        },
        {
            name: "Vehicles",
            path: "/vehicles",
            icon: "🚗",
        },
        {
            name: "Live Tracking",
            path: "/live-tracking",
            icon: "📍",
        },
        {
            name: "Location History",
            path: "/location-history",
            icon: "🛣️",
        },
    ];

    return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">

            {/* Logo */}
            <div className="mb-8">
                <h2 className="text-xl font-bold">
                    🚗 Vehicle Tracker
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                    Management System
                </p>
            </div>

            {/* Menu */}
            <nav className="space-y-2">

                {menuItems.map((item) => {

                    const active =
                        location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-800"
                            }`}
                        >
                            <span>{item.icon}</span>

                            <span>
                                {item.name}
                            </span>
                        </Link>
                    );

                })}

            </nav>

        </aside>
    );
}

export default Sidebar;