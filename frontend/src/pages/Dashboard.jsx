import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
    getLatestLocation,
    getVehicles,
} from "../services/vehicleService";

function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const response = await getVehicles(0, 100);

            const vehicleList =
                response?.content ||
                response?.data?.content ||
                response?.data ||
                response ||
                [];

            const list = Array.isArray(vehicleList) ? vehicleList : [];

            const vehiclesWithLocation = await Promise.all(
                list.map(async (vehicle) => {
                    try {
                        const location = await getLatestLocation(vehicle.id);

                        const latestLocation =
                            location?.data || location || null;

                        return {
                            ...vehicle,
                            latestLocation,
                        };
                    } catch (error) {
                        return {
                            ...vehicle,
                            latestLocation: null,
                        };
                    }
                })
            );

            setVehicles(vehiclesWithLocation);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Dashboard loading error:", error);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();

        const interval = setInterval(() => {
            loadDashboard();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const stats = useMemo(() => {
        const totalVehicles = vehicles.length;

        const activeVehicles = vehicles.filter((vehicle) => {
            const location = vehicle.latestLocation;

            if (!location) return false;

            const speed = Number(location.speed || 0);

            return speed > 0;
        }).length;

        const offlineVehicles = totalVehicles - activeVehicles;

        const movingVehicles = vehicles.filter((vehicle) => {
            const speed = Number(vehicle.latestLocation?.speed || 0);
            return speed > 0;
        }).length;

        return {
            totalVehicles,
            activeVehicles,
            offlineVehicles,
            movingVehicles,
        };
    }, [vehicles]);

    const getVehicleName = (vehicle) => {
        return (
            vehicle.vehicleNumber ||
            vehicle.registrationNumber ||
            vehicle.number ||
            `Vehicle #${vehicle.id}`
        );
    };

    const getVehicleType = (vehicle) => {
        return vehicle.vehicleType || vehicle.type || "Vehicle";
    };

    const getSpeed = (vehicle) => {
        return Number(vehicle.latestLocation?.speed || 0);
    };

    const getStatus = (vehicle) => {
        const speed = getSpeed(vehicle);

        if (!vehicle.latestLocation) {
            return "Offline";
        }

        if (speed > 0) {
            return "Moving";
        }

        return "Stopped";
    };

    const getStatusStyle = (status) => {
        if (status === "Moving") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Stopped") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-red-100 text-red-700";
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-4 md:p-6 lg:p-8">

                    {/* Header */}
                    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                                Fleet Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Monitor and manage your vehicles in real time.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-xs text-slate-400">
                                    Last updated
                                </p>

                                <p className="text-sm font-medium text-slate-600">
                                    {lastUpdated
                                        ? lastUpdated.toLocaleTimeString()
                                        : "Updating..."}
                                </p>
                            </div>

                            <button
                                onClick={loadDashboard}
                                className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {/* Total Vehicles */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Total Vehicles
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                        {loading ? "..." : stats.totalVehicles}
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                    🚗
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Registered vehicles
                            </p>
                        </div>

                        {/* Active */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Active Vehicles
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                                        {loading ? "..." : stats.activeVehicles}
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                                    ✓
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Currently moving
                            </p>
                        </div>

                        {/* Offline */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Offline Vehicles
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-red-500">
                                        {loading ? "..." : stats.offlineVehicles}
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
                                    ⚠
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                No live location
                            </p>
                        </div>

                        {/* Moving */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Vehicles Moving
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-indigo-600">
                                        {loading ? "..." : stats.movingVehicles}
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                                    ↗
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Live movement status
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

                        {/* Vehicle Status */}
                        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <div>
                                    <h2 className="font-bold text-slate-800">
                                        Vehicle Status
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Live fleet overview
                                    </p>
                                </div>

                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                                    Live
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px] text-left">
                                    <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Vehicle
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Type
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Speed
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Status
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-5 py-10 text-center text-sm text-slate-400"
                                            >
                                                Loading vehicles...
                                            </td>
                                        </tr>
                                    ) : vehicles.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-5 py-10 text-center text-sm text-slate-400"
                                            >
                                                No vehicles found
                                            </td>
                                        </tr>
                                    ) : (
                                        vehicles.map((vehicle) => {
                                            const status =
                                                getStatus(vehicle);

                                            return (
                                                <tr
                                                    key={vehicle.id}
                                                    className="transition hover:bg-slate-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                                🚗
                                                            </div>

                                                            <div>
                                                                <p className="font-semibold text-slate-700">
                                                                    {getVehicleName(
                                                                        vehicle
                                                                    )}
                                                                </p>

                                                                <p className="text-xs text-slate-400">
                                                                    ID:{" "}
                                                                    {
                                                                        vehicle.id
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-slate-500">
                                                        {getVehicleType(
                                                            vehicle
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                            <span className="font-semibold text-slate-700">
                                                                {getSpeed(
                                                                    vehicle
                                                                )}{" "}
                                                                km/h
                                                            </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                                    status
                                                                )}`}
                                                            >
                                                                {status}
                                                            </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Fleet Summary */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <h2 className="font-bold text-slate-800">
                                Fleet Summary
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Current vehicle distribution
                            </p>

                            <div className="mt-6 space-y-5">

                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Moving
                                        </span>

                                        <span className="font-semibold text-slate-700">
                                            {stats.activeVehicles}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-green-500"
                                            style={{
                                                width:
                                                    stats.totalVehicles > 0
                                                        ? `${
                                                            (stats.activeVehicles /
                                                                stats.totalVehicles) *
                                                            100
                                                        }%`
                                                        : "0%",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Offline
                                        </span>

                                        <span className="font-semibold text-slate-700">
                                            {stats.offlineVehicles}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-red-500"
                                            style={{
                                                width:
                                                    stats.totalVehicles > 0
                                                        ? `${
                                                            (stats.offlineVehicles /
                                                                stats.totalVehicles) *
                                                            100
                                                        }%`
                                                        : "0%",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Stopped
                                        </span>

                                        <span className="font-semibold text-slate-700">
                                            {Math.max(
                                                0,
                                                stats.totalVehicles -
                                                stats.activeVehicles -
                                                stats.offlineVehicles
                                            )}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-yellow-400"
                                            style={{
                                                width: "0%",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="mt-8 rounded-xl bg-slate-50 p-4">
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Tracking System Online
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            GPS data is being updated
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer info */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    Smart Vehicle Tracking System
                                </p>

                                <p className="text-xs text-slate-400">
                                    Real-time fleet monitoring dashboard
                                </p>
                            </div>

                            <p className="text-xs text-slate-400">
                                Auto refresh: 10 seconds
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;