import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AllVehiclesMap from "../components/AllVehiclesMap";
import {
    getVehicles,
    getLatestLocation,
    getLocationHistory,
} from "../services/vehicleService";

function LiveTracking() {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Vehicle Selection
    const [selectedVehicleId, setSelectedVehicleId] = useState("all");

    // Flow Mode
    const [flowMode, setFlowMode] = useState(false);

    // Selected vehicle location history
    const [locationHistory, setLocationHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);


    // ===============================
    // LOAD VEHICLES
    // ===============================

    const loadVehicles = async () => {

        try {

            const vehicleData = await getVehicles();

            const vehicleList = Array.isArray(vehicleData)
                ? vehicleData
                : vehicleData?.content || [];

            const updatedVehicles = await Promise.all(

                vehicleList.map(async (vehicle) => {

                    try {

                        const location =
                            await getLatestLocation(vehicle.id);

                        return {
                            ...vehicle,

                            latitude: location?.latitude,
                            longitude: location?.longitude,
                            speed: location?.speed,
                            recordedAt: location?.recordedAt,
                        };

                    } catch (error) {

                        console.error(
                            `Error loading location for vehicle ${vehicle.id}`,
                            error
                        );

                        return vehicle;
                    }
                })
            );

            setVehicles(updatedVehicles);
            setLastUpdated(new Date());

        } catch (error) {

            console.error("Error loading vehicles:", error);

        } finally {

            setLoading(false);

        }
    };


    // ===============================
    // LOAD VEHICLE HISTORY
    // ===============================

    const loadLocationHistory = async (vehicleId) => {

        if (!vehicleId || vehicleId === "all") {

            setLocationHistory([]);

            return;
        }

        try {

            setHistoryLoading(true);

            const historyData =
                await getLocationHistory(vehicleId);

            const historyList = Array.isArray(historyData)
                ? historyData
                : historyData?.content || [];

            setLocationHistory(historyList);

        } catch (error) {

            console.error(
                "Error loading location history:",
                error
            );

            setLocationHistory([]);

        } finally {

            setHistoryLoading(false);
        }
    };


    // ===============================
    // INITIAL LOAD + AUTO REFRESH
    // ===============================

    useEffect(() => {

        loadVehicles();

        const interval = setInterval(() => {

            loadVehicles();

        }, 5000);

        return () => clearInterval(interval);

    }, []);


    // ===============================
    // VEHICLE SELECTION / FLOW MODE
    // ===============================

    useEffect(() => {

        if (
            flowMode &&
            selectedVehicleId !== "all"
        ) {

            loadLocationHistory(selectedVehicleId);

        } else {

            setLocationHistory([]);

        }

    }, [selectedVehicleId, flowMode]);


    // ===============================
    // VEHICLE FILTER
    // ===============================

    const visibleVehicles =
        selectedVehicleId === "all"
            ? vehicles
            : vehicles.filter(
                (vehicle) =>
                    String(vehicle.id) ===
                    String(selectedVehicleId)
            );


    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="flex">

                <Sidebar />

                <main className="flex-1 p-6">

                    {/* ================= HEADER ================= */}

                    <div className="mb-8">

                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                            <div>

                                <h2 className="text-3xl font-bold text-gray-800">
                                    Live Tracking
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    Monitor your vehicles in real time
                                </p>

                            </div>

                            <div className="flex items-center gap-2">

                                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>

                                <span className="text-green-600 font-semibold">
                                    Live
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ================= MAP CARD ================= */}

                    <div className="bg-white rounded-xl shadow p-6 mb-6">

                        {/* MAP HEADER */}

                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-5">

                            <div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    📍 Vehicle Live Map
                                </h3>

                                <p className="text-gray-500 mt-1">
                                    Select a vehicle and track its movement
                                </p>

                            </div>


                            {/* CONTROLS */}

                            <div className="flex flex-col sm:flex-row gap-3">

                                {/* Vehicle Selection */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                                        Select Vehicle
                                    </label>

                                    <select
                                        value={selectedVehicleId}
                                        onChange={(e) =>
                                            setSelectedVehicleId(
                                                e.target.value
                                            )
                                        }
                                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white min-w-[220px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >

                                        <option value="all">
                                            🚗 All Vehicles
                                        </option>

                                        {vehicles.map((vehicle) => (

                                            <option
                                                key={vehicle.id}
                                                value={vehicle.id}
                                            >
                                                🚗 {vehicle.vehicleNumber} — ID {vehicle.id}
                                            </option>

                                        ))}

                                    </select>

                                </div>


                                {/* Flow Mode */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                                        Tracking Mode
                                    </label>

                                    <button
                                        onClick={() =>
                                            setFlowMode(!flowMode)
                                        }
                                        disabled={
                                            selectedVehicleId === "all"
                                        }
                                        className={`px-5 py-2 rounded-lg font-semibold transition ${
                                            selectedVehicleId === "all"
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : flowMode
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >

                                        {flowMode
                                            ? "🛣️ Flow Mode ON"
                                            : "📍 Flow Mode OFF"}

                                    </button>

                                </div>

                            </div>

                        </div>


                        {/* FLOW INFO */}

                        {flowMode &&
                            selectedVehicleId !== "all" && (

                                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">

                                    <div className="flex items-center gap-2">

                                        <span className="text-blue-600">
                                            🛣️
                                        </span>

                                        <p className="text-blue-700 text-sm font-medium">

                                            {historyLoading
                                                ? "Loading vehicle route..."
                                                : `Showing movement flow for Vehicle ID ${selectedVehicleId}`
                                            }

                                        </p>

                                    </div>

                                </div>

                            )}


                        {/* MAP */}

                        {loading ? (

                            <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">

                                <p className="text-gray-500">
                                    Loading live vehicle locations...
                                </p>

                            </div>

                        ) : (

                            <AllVehiclesMap
                                vehicles={visibleVehicles}
                                flowMode={flowMode}
                                locationHistory={locationHistory}
                            />

                        )}

                    </div>


                    {/* ================= VEHICLE CARDS ================= */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <div className="flex justify-between items-center mb-6">

                            <div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    🚗 Live Vehicles
                                </h3>

                                <p className="text-gray-500 mt-1">
                                    Current GPS information
                                </p>

                            </div>

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {visibleVehicles.length} Vehicles
                            </span>

                        </div>


                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            {visibleVehicles.length === 0 ? (

                                <div className="lg:col-span-2 text-center py-10">

                                    <p className="text-gray-500">
                                        No vehicle available
                                    </p>

                                </div>

                            ) : (

                                visibleVehicles.map((vehicle) => (

                                    <div
                                        key={vehicle.id}
                                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                                    >

                                        <div className="flex justify-between items-center mb-5">

                                            <div>

                                                <h4 className="text-lg font-bold text-gray-800">
                                                    🚗 {vehicle.vehicleNumber}
                                                </h4>

                                                <p className="text-gray-500 text-sm">
                                                    Vehicle ID: {vehicle.id}
                                                </p>

                                            </div>

                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                ● {vehicle.status}
                                            </span>

                                        </div>


                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                            <div>

                                                <p className="text-gray-500 text-sm">
                                                    Latitude
                                                </p>

                                                <p className="font-semibold mt-1">

                                                    {vehicle.latitude !== undefined &&
                                                    vehicle.latitude !== null
                                                        ? Number(
                                                            vehicle.latitude
                                                        ).toFixed(6)
                                                        : "N/A"}

                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-gray-500 text-sm">
                                                    Longitude
                                                </p>

                                                <p className="font-semibold mt-1">

                                                    {vehicle.longitude !== undefined &&
                                                    vehicle.longitude !== null
                                                        ? Number(
                                                            vehicle.longitude
                                                        ).toFixed(6)
                                                        : "N/A"}

                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-gray-500 text-sm">
                                                    Current Speed
                                                </p>

                                                <p className="font-semibold mt-1">
                                                    ⚡ {vehicle.speed ?? 0} km/h
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            )}

                        </div>


                        {/* LAST UPDATED */}

                        {lastUpdated && (

                            <p className="text-gray-400 text-sm mt-6 text-right">

                                Last updated:{" "}
                                {lastUpdated.toLocaleTimeString()}

                            </p>

                        )}

                    </div>

                </main>

            </div>

        </div>

    );
}

export default LiveTracking;