import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";

import L from "leaflet";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// ======================================================
// AUTO MAP FOLLOW
// ======================================================

function MapController({
                           vehicles,
                           flowMode,
                           locationHistory,
                       }) {
    const map = useMap();

    useEffect(() => {

        let points = [];

        if (
            flowMode &&
            locationHistory &&
            locationHistory.length > 0
        ) {
            points = locationHistory
                .filter(
                    (location) =>
                        location.latitude !== null &&
                        location.latitude !== undefined &&
                        location.longitude !== null &&
                        location.longitude !== undefined
                )
                .map((location) => [
                    Number(location.latitude),
                    Number(location.longitude),
                ]);
        }

        if (points.length === 0) {

            points = vehicles
                .filter(
                    (vehicle) =>
                        vehicle.latitude !== null &&
                        vehicle.latitude !== undefined &&
                        vehicle.longitude !== null &&
                        vehicle.longitude !== undefined
                )
                .map((vehicle) => [
                    Number(vehicle.latitude),
                    Number(vehicle.longitude),
                ]);
        }

        if (points.length > 0) {

            map.fitBounds(points, {
                padding: [40, 40],
                maxZoom: 15,
            });

        }

    }, [
        vehicles,
        flowMode,
        locationHistory,
        map,
    ]);

    return null;
}


// ======================================================
// SMOOTH VEHICLE MARKER
// ======================================================

function SmoothMarker({
                          vehicle,
                          flowMode,
                      }) {

    const targetLat = Number(vehicle.latitude);
    const targetLng = Number(vehicle.longitude);

    const [position, setPosition] = useState([
        targetLat,
        targetLng,
    ]);

    const animationRef = useRef(null);

    const previousTargetRef = useRef([
        targetLat,
        targetLng,
    ]);


    useEffect(() => {

        const startLat =
            previousTargetRef.current[0];

        const startLng =
            previousTargetRef.current[1];

        const endLat = targetLat;
        const endLng = targetLng;


        if (
            !Number.isFinite(endLat) ||
            !Number.isFinite(endLng)
        ) {
            return;
        }


        // Cancel previous animation
        if (animationRef.current) {
            cancelAnimationFrame(
                animationRef.current
            );
        }


        // If first location
        if (
            startLat === endLat &&
            startLng === endLng
        ) {

            setPosition([
                endLat,
                endLng,
            ]);

            previousTargetRef.current = [
                endLat,
                endLng,
            ];

            return;
        }


        // Smooth animation duration
        const duration = flowMode
            ? 9000
            : 1500;

        const startTime = performance.now();


        const animate = (currentTime) => {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            // Ease in/out
            const eased =
                progress < 0.5
                    ? 2 * progress * progress
                    : 1 -
                    Math.pow(
                        -2 * progress + 2,
                        2
                    ) / 2;


            const currentLat =
                startLat +
                (endLat - startLat) *
                eased;

            const currentLng =
                startLng +
                (endLng - startLng) *
                eased;


            setPosition([
                currentLat,
                currentLng,
            ]);


            if (progress < 1) {

                animationRef.current =
                    requestAnimationFrame(
                        animate
                    );

            } else {

                previousTargetRef.current = [
                    endLat,
                    endLng,
                ];

            }

        };


        animationRef.current =
            requestAnimationFrame(
                animate
            );


        return () => {

            if (animationRef.current) {

                cancelAnimationFrame(
                    animationRef.current
                );

            }

        };

    }, [
        targetLat,
        targetLng,
        flowMode,
    ]);


    const status =
        vehicle.status?.toLowerCase();

    const isRunning =
        status === "running" ||
        status === "active";


    return (

        <Marker
            position={position}
        >

            <Popup>

                <div className="min-w-[220px]">

                    <h3 className="text-lg font-bold text-gray-800">
                        🚗 {vehicle.vehicleNumber}
                    </h3>

                    <p className="text-gray-500 text-sm">
                        Vehicle ID: {vehicle.id}
                    </p>

                    <hr className="my-3" />


                    {/* Status */}

                    <p className="mb-2">

                        <strong>
                            Status:
                        </strong>{" "}

                        <span
                            className={
                                isRunning
                                    ? "text-green-600 font-semibold"
                                    : "text-red-600 font-semibold"
                            }
                        >

                            {isRunning
                                ? "🟢 Running"
                                : "🔴 Offline"}

                        </span>

                    </p>


                    {/* Speed */}

                    <p className="mb-2">

                        <strong>
                            Speed:
                        </strong>{" "}

                        ⚡ {vehicle.speed ?? 0} km/h

                    </p>


                    {/* Latitude */}

                    <p className="mb-2">

                        <strong>
                            Latitude:
                        </strong>{" "}

                        {position[0].toFixed(6)}

                    </p>


                    {/* Longitude */}

                    <p className="mb-2">

                        <strong>
                            Longitude:
                        </strong>{" "}

                        {position[1].toFixed(6)}

                    </p>


                    {/* Last update */}

                    {vehicle.recordedAt && (

                        <p className="mb-3 text-gray-500 text-sm">

                            🕐 Last Update:{" "}

                            {new Date(
                                vehicle.recordedAt
                            ).toLocaleString()}

                        </p>

                    )}


                    {flowMode && (

                        <p className="mb-3 text-blue-600 text-sm font-semibold">
                            🛣️ Smooth Flow Mode Active
                        </p>

                    )}


                    {/* Details */}

                    <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        View Vehicle Details
                    </Link>

                </div>

            </Popup>

        </Marker>

    );
}


// ======================================================
// MAIN MAP
// ======================================================

function AllVehiclesMap({
                            vehicles,
                            flowMode = false,
                            locationHistory = [],
                        }) {

    const validVehicles =
        vehicles.filter(
            (vehicle) =>
                vehicle.latitude !== null &&
                vehicle.latitude !== undefined &&
                vehicle.longitude !== null &&
                vehicle.longitude !== undefined
        );


    // ==================================================
    // HISTORY ROUTE
    // ==================================================

    const validHistory =
        locationHistory

            .filter(
                (location) =>
                    location.latitude !== null &&
                    location.latitude !== undefined &&
                    location.longitude !== null &&
                    location.longitude !== undefined
            )

            .map((location) => [
                Number(location.latitude),
                Number(location.longitude),
            ]);


    // ==================================================
    // NO LOCATION
    // ==================================================

    if (validVehicles.length === 0) {

        return (

            <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">

                <p className="text-gray-500">
                    📍 No vehicle location available
                </p>

            </div>

        );

    }


    const firstVehicle =
        validVehicles[0];


    return (

        <div className="w-full h-[500px] rounded-xl overflow-hidden">

            <MapContainer
                center={[
                    Number(firstVehicle.latitude),
                    Number(firstVehicle.longitude),
                ]}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full"
            >

                {/* OpenStreetMap */}

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {/* Auto map controller */}

                <MapController
                    vehicles={validVehicles}
                    flowMode={flowMode}
                    locationHistory={locationHistory}
                />


                {/* ==================================================
                    FLOW ROUTE
                ================================================== */}

                {flowMode &&
                    validHistory.length >= 2 && (

                        <Polyline
                            positions={validHistory}
                            pathOptions={{
                                weight: 5,
                                opacity: 0.8,
                            }}
                        />

                    )}


                {/* ==================================================
                    VEHICLE MARKERS
                ================================================== */}

                {validVehicles.map(
                    (vehicle) => (

                        <SmoothMarker
                            key={vehicle.id}
                            vehicle={vehicle}
                            flowMode={flowMode}
                        />

                    )
                )}

            </MapContainer>

        </div>

    );
}

export default AllVehiclesMap;