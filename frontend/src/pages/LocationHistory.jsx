import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LocationHistoryMap from "../components/LocationHistoryMap";

import {
    getVehicles,
    getLocationHistory,
} from "../services/vehicleService";


function LocationHistory() {

    const [vehicles, setVehicles] = useState([]);

    const [selectedVehicleId, setSelectedVehicleId] =
        useState("");

    const [locations, setLocations] = useState([]);

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");

    const [loading, setLoading] = useState(false);

    const [vehicleLoading, setVehicleLoading] =
        useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD VEHICLES
    // ==========================================

    useEffect(() => {

        const loadVehicles = async () => {

            try {

                setVehicleLoading(true);

                const data = await getVehicles();

                console.log("Vehicles:", data);

                const vehicleList =
                    Array.isArray(data)
                        ? data
                        : data?.content || [];

                setVehicles(vehicleList);

            } catch (error) {

                console.error(
                    "Vehicle loading error:",
                    error
                );

                setError(
                    "Unable to load vehicles."
                );

            } finally {

                setVehicleLoading(false);

            }

        };

        loadVehicles();

    }, []);


    // ==========================================
    // LOAD LOCATION HISTORY
    // ==========================================

    const handleSearch = async () => {

        if (!selectedVehicleId) {

            setError(
                "Please select a vehicle first."
            );

            return;

        }


        if (
            fromDate &&
            toDate &&
            fromDate > toDate
        ) {

            setError(
                "From date cannot be greater than To date."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            console.log(
                "Loading history for vehicle:",
                selectedVehicleId
            );

            const data =
                await getLocationHistory(
                    selectedVehicleId
                );

            console.log(
                "Location history response:",
                data
            );

            const locationList =
                Array.isArray(data)
                    ? data
                    : data?.content || [];

            console.log(
                "All location records:",
                locationList
            );

            setLocations(locationList);

        } catch (error) {

            console.error(
                "Location history error:",
                error
            );

            setLocations([]);

            setError(
                "Unable to load location history."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FILTER LOCATIONS BY DATE
    // ==========================================

    const filteredLocations = useMemo(() => {

        if (!fromDate && !toDate) {
            return locations;
        }

        return locations.filter((location) => {

            if (!location.recordedAt) {
                return false;
            }

            const locationDate =
                new Date(location.recordedAt);

            if (
                Number.isNaN(
                    locationDate.getTime()
                )
            ) {
                return false;
            }


            // Start of selected From Date
            if (fromDate) {

                const startDate =
                    new Date(
                        `${fromDate}T00:00:00`
                    );

                if (locationDate < startDate) {
                    return false;
                }

            }


            // End of selected To Date
            if (toDate) {

                const endDate =
                    new Date(
                        `${toDate}T23:59:59.999`
                    );

                if (locationDate > endDate) {
                    return false;
                }

            }


            return true;

        });

    }, [
        locations,
        fromDate,
        toDate,
    ]);


    // ==========================================
    // SELECTED VEHICLE
    // ==========================================

    const selectedVehicle =
        vehicles.find(
            (vehicle) =>
                String(vehicle.id) ===
                String(selectedVehicleId)
        );


    // ==========================================
    // VALID LOCATIONS
    // ==========================================

    const validLocations =
        filteredLocations.filter(
            (location) => {

                const latitude =
                    Number(location.latitude);

                const longitude =
                    Number(location.longitude);

                return (
                    Number.isFinite(latitude) &&
                    Number.isFinite(longitude)
                );

            }
        );


    // ==========================================
    // DISTANCE CALCULATION
    // ==========================================

    const calculateDistance = (
        lat1,
        lon1,
        lat2,
        lon2
    ) => {

        const R = 6371;

        const dLat =
            (lat2 - lat1) *
            Math.PI /
            180;

        const dLon =
            (lon2 - lon1) *
            Math.PI /
            180;

        const a =
            Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +

            Math.cos(
                lat1 * Math.PI / 180
            ) *

            Math.cos(
                lat2 * Math.PI / 180
            ) *

            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return R * c;

    };


    let totalDistance = 0;


    for (
        let i = 1;
        i < validLocations.length;
        i++
    ) {

        const previous =
            validLocations[i - 1];

        const current =
            validLocations[i];

        totalDistance +=
            calculateDistance(

                Number(previous.latitude),
                Number(previous.longitude),

                Number(current.latitude),
                Number(current.longitude)

            );

    }


    // ==========================================
    // SPEED
    // ==========================================

    const speeds =
        validLocations.map(
            (location) =>
                Number(location.speed) || 0
        );


    const maxSpeed =
        speeds.length > 0
            ? Math.max(...speeds)
            : 0;


    const averageSpeed =
        speeds.length > 0
            ? (
                speeds.reduce(
                    (sum, speed) =>
                        sum + speed,
                    0
                ) /
                speeds.length
            ).toFixed(1)
            : 0;


    // ==========================================
    // START / END
    // ==========================================

    const startLocation =
        validLocations.length > 0
            ? validLocations[0]
            : null;


    const endLocation =
        validLocations.length > 0
            ? validLocations[
            validLocations.length - 1
                ]
            : null;


    // ==========================================
    // DURATION
    // ==========================================

    let durationText = "N/A";


    if (
        startLocation?.recordedAt &&
        endLocation?.recordedAt
    ) {

        const start =
            new Date(
                startLocation.recordedAt
            );

        const end =
            new Date(
                endLocation.recordedAt
            );

        const difference =
            end.getTime() -
            start.getTime();


        if (difference >= 0) {

            const totalMinutes =
                Math.floor(
                    difference /
                    (1000 * 60)
                );

            const hours =
                Math.floor(
                    totalMinutes / 60
                );

            const minutes =
                totalMinutes % 60;

            durationText =
                `${hours}h ${minutes}m`;

        }

    }


    // ==========================================
    // DATE FORMAT
    // ==========================================

    const formatDateTime = (date) => {

        if (!date) {
            return "N/A";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "N/A";
        }

        return parsedDate.toLocaleString();

    };


    // ==========================================
    // RESET
    // ==========================================

    const handleReset = () => {

        setSelectedVehicleId("");

        setLocations([]);

        setFromDate("");

        setToDate("");

        setError("");

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="flex">

                <Sidebar />

                <main className="flex-1 p-6">


                    {/* HEADER */}

                    <div className="mb-8">

                        <h2 className="text-3xl font-bold text-gray-800">
                            Location History
                        </h2>

                        <p className="text-gray-500 mt-1">
                            View and analyze vehicle movement history
                        </p>

                    </div>


                    {/* FILTER PANEL */}

                    <div className="bg-white rounded-xl shadow p-6 mb-6">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


                            {/* VEHICLE */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Vehicle
                                </label>

                                <select

                                    value={
                                        selectedVehicleId
                                    }

                                    onChange={(e) => {

                                        setSelectedVehicleId(
                                            e.target.value
                                        );

                                        setLocations([]);

                                        setError("");

                                    }}

                                    disabled={
                                        vehicleLoading
                                    }

                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"

                                >

                                    <option value="">
                                        Select Vehicle
                                    </option>


                                    {vehicles.map(
                                        (vehicle) => (

                                            <option
                                                key={
                                                    vehicle.id
                                                }
                                                value={
                                                    vehicle.id
                                                }
                                            >

                                                🚗{" "}
                                                {
                                                    vehicle.vehicleNumber
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* FROM DATE */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    From Date
                                </label>

                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) =>
                                        setFromDate(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* TO DATE */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    To Date
                                </label>

                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) =>
                                        setToDate(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="flex items-end gap-2">

                                <button
                                    onClick={
                                        handleSearch
                                    }
                                    disabled={
                                        loading ||
                                        !selectedVehicleId
                                    }
                                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 transition"
                                >

                                    {loading
                                        ? "Loading..."
                                        : "🔍 Search"}

                                </button>


                                <button
                                    onClick={
                                        handleReset
                                    }
                                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                                >

                                    ↻

                                </button>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">

                                ⚠️ {error}

                            </div>

                        )}

                    </div>


                    {/* VEHICLE INFO */}

                    {selectedVehicle && (

                        <div className="bg-white rounded-xl shadow p-6 mb-6">

                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                                <div>

                                    <h3 className="text-xl font-bold text-gray-800">

                                        🚗{" "}
                                        {
                                            selectedVehicle.vehicleNumber
                                        }

                                    </h3>

                                    <p className="text-gray-500 text-sm mt-1">

                                        Vehicle ID:{" "}
                                        {
                                            selectedVehicle.id
                                        }

                                    </p>

                                </div>


                                <div className="flex gap-3 flex-wrap">

                                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">

                                        {filteredLocations.length} Filtered Points

                                    </span>

                                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">

                                        {locations.length} Total Points

                                    </span>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* STATISTICS */}

                    {validLocations.length > 0 && (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">


                            {/* DISTANCE */}

                            <div className="bg-white rounded-xl shadow p-5">

                                <p className="text-gray-500 text-sm">
                                    Total Distance
                                </p>

                                <p className="text-2xl font-bold text-gray-800 mt-2">
                                    {totalDistance.toFixed(2)} km
                                </p>

                            </div>


                            {/* MAX SPEED */}

                            <div className="bg-white rounded-xl shadow p-5">

                                <p className="text-gray-500 text-sm">
                                    Maximum Speed
                                </p>

                                <p className="text-2xl font-bold text-gray-800 mt-2">
                                    ⚡ {maxSpeed} km/h
                                </p>

                            </div>


                            {/* AVERAGE SPEED */}

                            <div className="bg-white rounded-xl shadow p-5">

                                <p className="text-gray-500 text-sm">
                                    Average Speed
                                </p>

                                <p className="text-2xl font-bold text-gray-800 mt-2">
                                    ⚡ {averageSpeed} km/h
                                </p>

                            </div>


                            {/* DURATION */}

                            <div className="bg-white rounded-xl shadow p-5">

                                <p className="text-gray-500 text-sm">
                                    Duration
                                </p>

                                <p className="text-2xl font-bold text-gray-800 mt-2">
                                    ⏱️ {durationText}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* MAP */}

                    <div className="bg-white rounded-xl shadow p-6 mb-6">

                        <div className="mb-5">

                            <h3 className="text-xl font-bold text-gray-800">
                                🗺️ Vehicle Route
                            </h3>

                            <p className="text-gray-500 mt-1">

                                {selectedVehicle
                                    ? `Movement history of ${selectedVehicle.vehicleNumber}`
                                    : "Select a vehicle to view its route"}

                            </p>

                        </div>


                        {loading ? (

                            <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">

                                <p className="text-gray-500">
                                    Loading location history...
                                </p>

                            </div>

                        ) : (

                            <LocationHistoryMap
                                locations={
                                    filteredLocations
                                }
                                vehicleNumber={
                                    selectedVehicle?.vehicleNumber
                                }
                            />

                        )}

                    </div>


                    {/* LOCATION RECORDS */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">

                            <div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    📋 Location Records
                                </h3>

                                <p className="text-gray-500 text-sm mt-1">
                                    GPS location history
                                </p>

                            </div>


                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">

                                {filteredLocations.length} Records

                            </span>

                        </div>


                        {filteredLocations.length === 0 ? (

                            <div className="text-center py-10">

                                <div className="text-4xl mb-3">
                                    📍
                                </div>

                                <p className="text-gray-500">
                                    No records found for selected filter.
                                </p>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full text-left">

                                    <thead>

                                    <tr className="border-b border-gray-200">

                                        <th className="px-4 py-3">
                                            #
                                        </th>

                                        <th className="px-4 py-3">
                                            Time
                                        </th>

                                        <th className="px-4 py-3">
                                            Latitude
                                        </th>

                                        <th className="px-4 py-3">
                                            Longitude
                                        </th>

                                        <th className="px-4 py-3">
                                            Speed
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {filteredLocations.map(
                                        (
                                            location,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    location.id ??
                                                    index
                                                }
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >

                                                <td className="px-4 py-3">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-3 text-sm">

                                                    {formatDateTime(
                                                        location.recordedAt
                                                    )}

                                                </td>

                                                <td className="px-4 py-3 text-sm">

                                                    {Number(
                                                        location.latitude
                                                    ).toFixed(6)}

                                                </td>

                                                <td className="px-4 py-3 text-sm">

                                                    {Number(
                                                        location.longitude
                                                    ).toFixed(6)}

                                                </td>

                                                <td className="px-4 py-3 text-sm">

                                                    ⚡{" "}
                                                    {
                                                        location.speed ??
                                                        0
                                                    }{" "}
                                                    km/h

                                                </td>

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </main>

            </div>

        </div>

    );
}

export default LocationHistory;