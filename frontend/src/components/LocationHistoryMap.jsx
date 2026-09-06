import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";

import { useEffect, useMemo, useRef, useState } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ==========================================
// MAP FOLLOW COMPONENT
// ==========================================

function MapFollower({ position, enabled }) {

    const map = useMap();

    useEffect(() => {

        if (!enabled || !position) {
            return;
        }

        map.panTo(position, {
            animate: true,
            duration: 0.5,
        });

    }, [position, enabled, map]);

    return null;
}


// ==========================================
// MAIN COMPONENT
// ==========================================

function LocationHistoryMap({
                                locations = [],
                                vehicleNumber,
                            }) {

    // ==========================================
    // VALID LOCATIONS
    // ==========================================

    const validLocations = useMemo(() => {

        return locations.filter((location) => {

            const latitude =
                Number(location.latitude);

            const longitude =
                Number(location.longitude);

            return (
                Number.isFinite(latitude) &&
                Number.isFinite(longitude)
            );

        });

    }, [locations]);


    // ==========================================
    // COORDINATES
    // ==========================================

    const coordinates = useMemo(() => {

        return validLocations.map((location) => [

            Number(location.latitude),

            Number(location.longitude),

        ]);

    }, [validLocations]);


    // ==========================================
    // FLOW STATE
    // ==========================================

    const [flowIndex, setFlowIndex] =
        useState(0);

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [flowSpeed, setFlowSpeed] =
        useState(1);

    const [followVehicle, setFollowVehicle] =
        useState(true);


    const timerRef =
        useRef(null);


    // ==========================================
    // RESET WHEN DATA CHANGES
    // ==========================================

    useEffect(() => {

        setFlowIndex(0);

        setIsPlaying(false);

    }, [locations]);


    // ==========================================
    // FLOW TIMER
    // ==========================================

    useEffect(() => {

        if (!isPlaying) {
            return;
        }

        if (coordinates.length <= 1) {

            setIsPlaying(false);

            return;

        }


        timerRef.current =
            setInterval(() => {

                setFlowIndex((currentIndex) => {

                    if (
                        currentIndex >=
                        coordinates.length - 1
                    ) {

                        setIsPlaying(false);

                        return currentIndex;

                    }

                    return currentIndex + 1;

                });

            }, 1000 / flowSpeed);


        return () => {

            clearInterval(
                timerRef.current
            );

        };

    }, [
        isPlaying,
        flowSpeed,
        coordinates.length,
    ]);


    // ==========================================
    // NO DATA
    // ==========================================

    if (coordinates.length === 0) {

        return (
            <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">

                <div className="text-center">

                    <div className="text-5xl mb-3">
                        🗺️
                    </div>

                    <p className="text-gray-700 font-semibold">
                        No location history available
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                        Select a vehicle and search its GPS history.
                    </p>

                </div>

            </div>
        );

    }


    // ==========================================
    // CURRENT LOCATION
    // ==========================================

    const currentLocation =
        validLocations[
            flowIndex
            ] || validLocations[0];


    const currentPosition = [
        Number(currentLocation.latitude),
        Number(currentLocation.longitude),
    ];


    // ==========================================
    // START / END
    // ==========================================

    const startLocation =
        validLocations[0];

    const endLocation =
        validLocations[
        validLocations.length - 1
            ];


    const startPosition = [
        Number(startLocation.latitude),
        Number(startLocation.longitude),
    ];


    const endPosition = [
        Number(endLocation.latitude),
        Number(endLocation.longitude),
    ];


    // ==========================================
    // PLAYED ROUTE
    // ==========================================

    const playedCoordinates =
        coordinates.slice(
            0,
            flowIndex + 1
        );


    // ==========================================
    // PROGRESS
    // ==========================================

    const progress =
        coordinates.length > 1
            ? (
                (flowIndex /
                    (coordinates.length - 1)) *
                100
            )
            : 0;


    // ==========================================
    // FLOW ICON
    // ==========================================

    const flowIcon =
        L.divIcon({

            className: "",

            html: `
                <div style="
                    width:44px;
                    height:44px;
                    background:#2563eb;
                    border:4px solid white;
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    box-shadow:0 4px 12px rgba(0,0,0,0.4);
                    font-size:22px;
                ">
                    🚗
                </div>
            `,

            iconSize: [44, 44],

            iconAnchor: [22, 22],

        });


    // ==========================================
    // CONTROLS
    // ==========================================

    const handlePlay = () => {

        if (
            flowIndex >=
            coordinates.length - 1
        ) {

            setFlowIndex(0);

        }

        setIsPlaying(true);

    };


    const handlePause = () => {

        setIsPlaying(false);

    };


    const handleReset = () => {

        setIsPlaying(false);

        setFlowIndex(0);

    };


    const handleSliderChange = (event) => {

        setIsPlaying(false);

        setFlowIndex(
            Number(event.target.value)
        );

    };


    return (

        <div className="w-full">


            {/* ==================================
                FLOW CONTROL
            ================================== */}

            <div className="bg-gray-900 text-white rounded-xl p-5 mb-4">


                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


                    {/* TITLE */}

                    <div>

                        <p className="text-lg font-bold">
                            🚗 Route Flow Mode
                        </p>

                        <p className="text-gray-400 text-sm">
                            Replay vehicle movement
                        </p>

                    </div>


                    {/* BUTTONS */}

                    <div className="flex flex-wrap gap-2">


                        {!isPlaying ? (

                            <button
                                onClick={
                                    handlePlay
                                }
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
                            >
                                ▶ Play
                            </button>

                        ) : (

                            <button
                                onClick={
                                    handlePause
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition"
                            >
                                ⏸ Pause
                            </button>

                        )}


                        <button
                            onClick={
                                handleReset
                            }
                            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
                        >
                            🔄 Reset
                        </button>


                        {/* SPEED */}

                        <select

                            value={flowSpeed}

                            onChange={(e) =>
                                setFlowSpeed(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }

                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"

                        >

                            <option value={0.5}>
                                0.5x
                            </option>

                            <option value={1}>
                                1x
                            </option>

                            <option value={2}>
                                2x
                            </option>

                            <option value={4}>
                                4x
                            </option>

                            <option value={8}>
                                8x
                            </option>

                        </select>


                        {/* FOLLOW */}

                        <button
                            onClick={() =>
                                setFollowVehicle(
                                    !followVehicle
                                )
                            }
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                followVehicle
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            {followVehicle
                                ? "📍 Follow ON"
                                : "📍 Follow OFF"}
                        </button>

                    </div>

                </div>


                {/* ==================================
                    TIMELINE
                ================================== */}

                <div className="mt-5">


                    <div className="flex justify-between text-xs text-gray-400 mb-2">

                        <span>
                            Point {flowIndex + 1}
                        </span>

                        <span>
                            {coordinates.length} Points
                        </span>

                    </div>


                    <input
                        type="range"
                        min="0"
                        max={
                            coordinates.length - 1
                        }
                        value={flowIndex}
                        onChange={
                            handleSliderChange
                        }
                        className="w-full cursor-pointer"
                    />


                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">

                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                                width: `${progress}%`,
                            }}
                        />

                    </div>

                </div>

            </div>


            {/* ==================================
                CURRENT INFO
            ================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">


                {/* VEHICLE */}

                <div className="bg-white border border-gray-200 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                        Vehicle
                    </p>

                    <p className="font-bold text-gray-800 mt-1">
                        🚗 {vehicleNumber || "Vehicle"}
                    </p>

                </div>


                {/* LOCATION */}

                <div className="bg-white border border-gray-200 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                        Current Location
                    </p>

                    <p className="font-semibold text-gray-800 mt-1 text-sm">
                        {currentPosition[0].toFixed(6)}
                        {" , "}
                        {currentPosition[1].toFixed(6)}
                    </p>

                </div>


                {/* SPEED */}

                <div className="bg-white border border-gray-200 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                        Current Speed
                    </p>

                    <p className="font-bold text-gray-800 mt-1">
                        ⚡ {currentLocation.speed ?? 0} km/h
                    </p>

                </div>


                {/* TIME */}

                <div className="bg-white border border-gray-200 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                        Recorded At
                    </p>

                    <p className="font-semibold text-gray-800 mt-1 text-sm">

                        {currentLocation.recordedAt
                            ? new Date(
                                currentLocation.recordedAt
                            ).toLocaleString()
                            : "N/A"}

                    </p>

                </div>

            </div>


            {/* ==================================
                MAP
            ================================== */}

            <div className="h-96 w-full rounded-xl overflow-hidden">

                <MapContainer

                    center={
                        currentPosition
                    }

                    zoom={14}

                    scrollWheelZoom={true}

                    className="h-full w-full"

                >

                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                    {/* MAP FOLLOW */}

                    <MapFollower
                        position={
                            currentPosition
                        }
                        enabled={
                            followVehicle &&
                            isPlaying
                        }
                    />


                    {/* FULL ROUTE */}

                    {coordinates.length > 1 && (

                        <Polyline
                            positions={
                                coordinates
                            }
                            pathOptions={{
                                color: "gray",
                                weight: 4,
                                opacity: 0.5,
                            }}
                        />

                    )}


                    {/* PLAYED ROUTE */}

                    {playedCoordinates.length > 1 && (

                        <Polyline
                            positions={
                                playedCoordinates
                            }
                            pathOptions={{
                                color: "blue",
                                weight: 6,
                                opacity: 0.9,
                            }}
                        />

                    )}


                    {/* START MARKER */}

                    <Marker
                        position={
                            startPosition
                        }
                    >

                        <Popup>

                            <div className="text-sm">

                                <p className="font-bold text-green-600">
                                    🟢 Trip Start
                                </p>

                                <p className="mt-2">
                                    <strong>Vehicle:</strong>{" "}
                                    {vehicleNumber ||
                                        "Vehicle"}
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {startLocation.recordedAt
                                        ? new Date(
                                            startLocation.recordedAt
                                        ).toLocaleString()
                                        : "N/A"}
                                </p>

                            </div>

                        </Popup>

                    </Marker>


                    {/* END MARKER */}

                    {coordinates.length > 1 && (

                        <Marker
                            position={
                                endPosition
                            }
                        >

                            <Popup>

                                <div className="text-sm">

                                    <p className="font-bold text-red-600">
                                        🔴 Latest Location
                                    </p>

                                    <p className="mt-2">
                                        <strong>Vehicle:</strong>{" "}
                                        {vehicleNumber ||
                                            "Vehicle"}
                                    </p>

                                    <p>
                                        <strong>Time:</strong>{" "}
                                        {endLocation.recordedAt
                                            ? new Date(
                                                endLocation.recordedAt
                                            ).toLocaleString()
                                            : "N/A"}
                                    </p>

                                </div>

                            </Popup>

                        </Marker>

                    )}


                    {/* MOVING VEHICLE */}

                    <Marker
                        position={
                            currentPosition
                        }
                        icon={
                            flowIcon
                        }
                    >

                        <Popup>

                            <div className="text-sm">

                                <p className="font-bold text-blue-600">
                                    🚗 Vehicle Flow
                                </p>

                                <p className="mt-2">
                                    <strong>Vehicle:</strong>{" "}
                                    {vehicleNumber ||
                                        "Vehicle"}
                                </p>

                                <p>
                                    <strong>Point:</strong>{" "}
                                    {flowIndex + 1}
                                </p>

                                <p>
                                    <strong>Speed:</strong>{" "}
                                    {currentLocation.speed ??
                                        0}{" "}
                                    km/h
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {currentLocation.recordedAt
                                        ? new Date(
                                            currentLocation.recordedAt
                                        ).toLocaleString()
                                        : "N/A"}
                                </p>

                            </div>

                        </Popup>

                    </Marker>

                </MapContainer>

            </div>

        </div>

    );
}

export default LocationHistoryMap;