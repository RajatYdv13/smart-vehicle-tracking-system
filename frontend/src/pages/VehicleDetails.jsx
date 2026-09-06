import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VehicleMap from "../components/VehicleMap";
import LocationHistoryMap from "../components/LocationHistoryMap";
import { Link, useParams } from "react-router-dom";

import {
    getVehicleById,
    getLatestLocation,
    getLocationHistory,
} from "../services/vehicleService";

function VehicleDetails() {
    const { id } = useParams();

    const [vehicle, setVehicle] = useState(null);
    const [latestLocation, setLatestLocation] = useState(null);
    const [locationHistory, setLocationHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);

    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [historyError, setHistoryError] = useState("");

    useEffect(() => {
        loadVehicleDetails();
        loadLatestLocation();
        loadLocationHistory();
        const interval =setInterval(()=>{
            loadLatestLocation();
            loadLocationHistory();
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [id]);

    // Vehicle Details
    const loadVehicleDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getVehicleById(id);

            setVehicle(data);
        } catch (err) {
            console.error("Error loading vehicle:", err);
            setError("Unable to load vehicle details.");
        } finally {
            setLoading(false);
        }
    };

    // Latest GPS Location
    const loadLatestLocation = async () => {
        try {
            setLocationLoading(true);
            setLocationError("");

            const data = await getLatestLocation(id);

            setLatestLocation(data);
        } catch (err) {
            console.error("Error loading latest location:", err);
            setLocationError("Latest GPS location is not available.");
        } finally {
            setLocationLoading(false);
        }
    };

    // Location History
    const loadLocationHistory = async () => {
        try {
            setHistoryLoading(true);
            setHistoryError("");

            const data = await getLocationHistory(id);

            setLocationHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error loading location history:", err);
            setHistoryError("Location history is not available.");
        } finally {
            setHistoryLoading(false);
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />

                <div className="flex">
                    <Sidebar />

                    <main className="flex-1 p-6">
                        <div className="bg-white rounded-xl shadow p-10 text-center">
                            <div className="text-4xl mb-4">
                                🚗
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800">
                                Loading vehicle details...
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Please wait while we fetch the vehicle data.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />

                <div className="flex">
                    <Sidebar />

                    <main className="flex-1 p-6">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">

                            <h2 className="text-xl font-semibold text-red-700">
                                Error
                            </h2>

                            <p className="text-red-600 mt-2">
                                {error}
                            </p>

                            <Link
                                to="/vehicles"
                                className="inline-block mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                            >
                                ← Back to Vehicles
                            </Link>

                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Vehicle Not Found
    if (!vehicle) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />

                <div className="flex">
                    <Sidebar />

                    <main className="flex-1 p-6">
                        <div className="bg-white rounded-xl shadow p-8 text-center">

                            <div className="text-5xl mb-4">
                                🚗
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800">
                                Vehicle not found
                            </h2>

                            <Link
                                to="/vehicles"
                                className="inline-block mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
                            >
                                ← Back to Vehicles
                            </Link>

                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Current GPS Values
    const currentLatitude =
        latestLocation?.latitude ?? vehicle.latitude ?? null;

    const currentLongitude =
        latestLocation?.longitude ?? vehicle.longitude ?? null;

    const currentSpeed =
        latestLocation?.speed ?? vehicle.speed ?? 0;

    const getGpsStatus =() => {
        if (!latestLocation?.recordedAt){
            return{
                text: "GPS Data Unavailable",
                className: "bg-red-100 text-red-700",
            };
        }
        const recordedAt = new Date(latestLocation.recordedAt).getTime();
        const currentTime = Date.now();

        const diffrenceInSeconds =
            (currentTime - recordedAt ) / 1000;
        if (diffrenceInSeconds <=30){
            return {
                text: "GPS Connected",
                className: "bg-green-100 text-green-700",
            };
        }
        if (diffrenceInSeconds<=120){
            return {
                text: "GPS Inactive",
                className: "bg-yellow-100 text-yellow-700",
            };
        }
        return {
            text: "GPS Offline",
            className: "bg-red-100 text-red-700",
        };
    };
    const gpsStatus = getGpsStatus();

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
                                Vehicle Details
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Detailed vehicle information and current GPS status
                            </p>
                        </div>

                        <Link
                            to="/vehicles"
                            className="w-fit bg-gray-200 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-300 transition"
                        >
                            ← Back to Vehicles
                        </Link>

                    </div>

                    {/* Vehicle Header */}
                    <div className="bg-white rounded-xl shadow p-6 mb-6">

                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Vehicle Number
                                </p>

                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    {vehicle.vehicleNumber}
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    Vehicle ID: {vehicle.id}
                                </p>
                            </div>

                            <span
                                className={`w-fit px-4 py-2 rounded-full font-semibold ${
                                    vehicle.status?.toLowerCase() === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                ● {vehicle.status}
                            </span>

                        </div>

                    </div>

                    {/* Vehicle Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {/* Owner */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <p className="text-gray-500 text-sm">
                                Owner
                            </p>

                            <h3 className="text-xl font-semibold mt-2">
                                {vehicle.ownerName || "N/A"}
                            </h3>
                        </div>

                        {/* Driver */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <p className="text-gray-500 text-sm">
                                Driver
                            </p>

                            <h3 className="text-xl font-semibold mt-2">
                                {vehicle.driverName || "N/A"}
                            </h3>
                        </div>

                        {/* Vehicle Type */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <p className="text-gray-500 text-sm">
                                Vehicle Type
                            </p>

                            <h3 className="text-xl font-semibold mt-2">
                                🚗 {vehicle.vehicleType || "N/A"}
                            </h3>
                        </div>

                        {/* Speed */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <p className="text-gray-500 text-sm">
                                Current Speed
                            </p>

                            <h3 className="text-xl font-semibold mt-2">
                                ⚡ {currentSpeed} km/h
                            </h3>
                        </div>

                        {/* Latitude */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <p className="text-gray-500 text-sm">
                                Latitude
                            </p>

                            <h3 className="text-xl font-semibold mt-2">
                                {currentLatitude ?? "N/A"}
                            </h3>
                        </div>

                        {/* Longitude */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <p className="text-gray-500 text-sm">
                                Longitude
                            </p>

                            <h3 className="text-xl font-semibold mt-2">
                                {currentLongitude ?? "N/A"}
                            </h3>
                        </div>

                    </div>

                    {/* Current GPS Location */}
                    <div className="bg-white rounded-xl shadow p-6 mt-6">

                        <p className="text-gray-500 text-sm">
                            Current GPS Location
                        </p>

                        {locationLoading ? (
                            <p className="text-gray-500 mt-2">
                                Loading latest GPS location...
                            </p>
                        ) : locationError ? (
                            <p className="text-orange-600 mt-2">
                                {locationError}
                            </p>
                        ) : (
                            <h3 className="text-lg font-semibold mt-2">
                                📍 {currentLatitude ?? "N/A"},{" "}
                                {currentLongitude ?? "N/A"}
                            </h3>
                        )}

                    </div>

                    {/* Last Location Update */}
                    <div className="bg-white rounded-xl shadow p-6 mt-6">

                        <p className="text-gray-500 text-sm">
                            Last Location Update
                        </p>

                        {locationLoading ? (
                            <p className="text-gray-500 mt-2">
                                Loading...
                            </p>
                        ) : latestLocation ? (
                            <div className="mt-2 space-y-1">

                                <h3 className="text-lg font-semibold">
                                    📍 GPS location received
                                </h3>

                                <p className="text-gray-500">
                                    Latitude: {currentLatitude}
                                </p>

                                <p className="text-gray-500">
                                    Longitude: {currentLongitude}
                                </p>

                            </div>
                        ) : (
                            <p className="text-gray-500 mt-2">
                                No latest location available.
                            </p>
                        )}

                    </div>

                    {/* Live Tracking */}
                    <div className="bg-white rounded-xl shadow p-6 mt-6">

                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">

                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    📍 Live Tracking
                                </h3>

                                <p className="text-gray-500 mt-1">
                                    Current GPS coordinates of the vehicle
                                </p>
                            </div>

                            <span
                          className={`w-fit px-3 py-1 rounded-full text-sm font-medium ${gpsStatus.className}`}
                          >
                                {gpsStatus.text}
                            </span>

                        </div>

                        {/* Actual Map */}
                        <div className="mt-5">

                            <VehicleMap
                                latitude={currentLatitude}
                                longitude={currentLongitude}
                                vehicleNumber={vehicle.vehicleNumber}
                            />

                        </div>

                    </div>

                    {/* Location History */}
                    <div className="bg-white rounded-xl shadow p-6 mt-6">

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                📍 Location History
                            </h3>

                            <p className="text-gray-500 mt-1">
                                Previous GPS locations of this vehicle
                            </p>
                        </div>
                        {historyLoading && locationHistory.length > 0 &&(
                            <div className="mb-6">
                                <LocationHistoryMap
                                    locations={locationHistory}
                                    vehicleNumber={vehicle.vehicleNumber}
                                    />
                            </div>
                        )}

                        {/* Loading */}
                        {historyLoading && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    Loading location history...
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {!historyLoading && historyError && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">

                                <p className="text-orange-700">
                                    {historyError}
                                </p>

                            </div>
                        )}

                        {/* Empty */}
                        {!historyLoading &&
                            !historyError &&
                            locationHistory.length === 0 && (
                                <div className="text-center py-8">

                                    <div className="text-4xl mb-3">
                                        📍
                                    </div>

                                    <p className="text-gray-500">
                                        No location history found.
                                    </p>

                                </div>
                            )}

                        {/* History List */}
                        {!historyLoading &&
                            !historyError &&
                            locationHistory.length > 0 && (
                                <div className="space-y-4">

                                    {locationHistory.map((location, index) => (

                                        <div
                                            key={location.id || index}
                                            className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition"
                                        >

                                            <div className="flex flex-col md:flex-row md:justify-between gap-4">

                                                <div>
                                                    <p className="text-gray-500 text-sm">
                                                        Location #{index + 1}
                                                    </p>

                                                    <h4 className="text-lg font-semibold text-gray-800 mt-1">
                                                        📍{" "}
                                                        {location.latitude ?? "N/A"},{" "}
                                                        {location.longitude ?? "N/A"}
                                                    </h4>
                                                </div>

                                                <div className="text-left md:text-right">

                                                    <p className="text-gray-500 text-sm">
                                                        Speed
                                                    </p>

                                                    <p className="font-semibold text-gray-800">
                                                        ⚡ {location.speed ?? 0} km/h
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>
                            )}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default VehicleDetails;