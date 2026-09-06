import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { getVehicles } from "../services/vehicleService";

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getVehicles(0, 5, "id", "asc");

            setVehicles(data.content || []);
        } catch (err) {
            console.error("Error loading vehicles:", err);
            setError("Unable to load vehicles. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <Navbar />

            <div className="flex">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-6">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                Vehicles
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Manage and monitor all registered vehicles
                            </p>
                        </div>

                        <button
                            type="button"
                            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Add Vehicle
                        </button>

                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="bg-white rounded-xl shadow p-8 text-center">
                            <div className="text-blue-600 text-lg font-semibold">
                                Loading vehicles...
                            </div>

                            <p className="text-gray-500 mt-2">
                                Fetching vehicle data from server.
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">

                            <h3 className="text-lg font-semibold text-red-700">
                                Failed to load vehicles
                            </h3>

                            <p className="text-red-600 mt-2">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadVehicles}
                                className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                            >
                                Try Again
                            </button>

                        </div>
                    )}

                    {/* No Vehicles */}
                    {!loading && !error && vehicles.length === 0 && (
                        <div className="bg-white rounded-xl shadow p-8 text-center">

                            <div className="text-5xl mb-4">
                                🚗
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800">
                                No Vehicles Found
                            </h3>

                            <p className="text-gray-500 mt-2">
                                There are no vehicles registered in the system.
                            </p>

                        </div>
                    )}

                    {/* Vehicle Cards */}
                    {!loading && !error && vehicles.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {vehicles.map((vehicle) => (

                                <div
                                    key={vehicle.id}
                                    className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                                >

                                    {/* Vehicle Number + Status */}
                                    <div className="flex justify-between items-start mb-5">

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Vehicle Number
                                            </p>

                                            <h3 className="text-xl font-bold text-gray-800 mt-1">
                                                {vehicle.vehicleNumber}
                                            </h3>
                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                vehicle.status?.toLowerCase() === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {vehicle.status}
                                        </span>

                                    </div>

                                    {/* Vehicle Information */}
                                    <div className="space-y-3 text-gray-600">

                                        <p>
                                            👤 <strong>Owner:</strong>{" "}
                                            {vehicle.ownerName || "N/A"}
                                        </p>

                                        <p>
                                            👨‍✈️ <strong>Driver:</strong>{" "}
                                            {vehicle.driverName || "N/A"}
                                        </p>

                                        <p>
                                            🚗 <strong>Type:</strong>{" "}
                                            {vehicle.vehicleType || "N/A"}
                                        </p>

                                        <p>
                                            ⚡ <strong>Speed:</strong>{" "}
                                            {vehicle.speed ?? 0} km/h
                                        </p>

                                        <p>
                                            📍 <strong>Latitude:</strong>{" "}
                                            {vehicle.latitude ?? "N/A"}
                                        </p>

                                        <p>
                                            📍 <strong>Longitude:</strong>{" "}
                                            {vehicle.longitude ?? "N/A"}
                                        </p>

                                    </div>

                                    {/* View Details */}
                                    <Link
                                        to={`/vehicles/${vehicle.id}`}
                                        className="block text-center mt-6 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            ))}

                        </div>
                    )}

                </main>

            </div>

        </div>
    );
}

export default Vehicles;