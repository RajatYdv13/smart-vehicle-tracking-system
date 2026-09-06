import {useEffect} from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

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


// Map ko latest location par move karne ke liye
function MapUpdater({ latitude, longitude }) {

    const map = useMap();

    useEffect(() => {
        if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
        ) {
            map.setView(
                [latitude, longitude],
                map.getZoom(),
                {
                    animate: true,
                }
            );
        }
    }, [latitude, longitude, map]);

    return null;
}


function VehicleMap({
                        latitude,
                        longitude,
                        vehicleNumber,
                    }) {

    const lat = Number(latitude);
    const lng = Number(longitude);


    // Invalid coordinates
    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        return (
            <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">

                <div className="text-center">

                    <div className="text-4xl mb-2">
                        📍
                    </div>

                    <p className="text-gray-600 font-medium">
                        GPS coordinates are not available.
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                        Unable to display vehicle location.
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="h-64 w-full rounded-xl overflow-hidden">

            <MapContainer
                center={[lat, lng]}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full"
            >

                {/* OpenStreetMap */}
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {/* Automatically move map */}
                <MapUpdater
                    latitude={lat}
                    longitude={lng}
                />


                {/* Vehicle Marker */}
                <Marker position={[lat, lng]}>

                    <Popup>

                        <div className="text-sm">

                            <p className="font-bold text-gray-800">
                                🚗 {vehicleNumber || "Vehicle"}
                            </p>

                            <p className="mt-1">
                                <strong>Latitude:</strong>{" "}
                                {lat}
                            </p>

                            <p>
                                <strong>Longitude:</strong>{" "}
                                {lng}
                            </p>

                        </div>

                    </Popup>

                </Marker>

            </MapContainer>

        </div>
    );
}

export default VehicleMap;