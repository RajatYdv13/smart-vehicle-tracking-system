import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getVehicles = async (
    page=0,
    size=5,
    sortBy="id",
    sortDir="asc"
) => {
    const response= await api.get("/vehicles",{
        params:{
            page,
            size,
            sortBy,
            sortDir,
    },
});
    return response.data;
};

export const getVehicleById = async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
};
export const getLatestLocation = async (id)=> {
    const response = await api.get(`/vehicles/${id}/locations/latest`);
    return response.data;
};
export const getLocationHistory = async (vehicleId) => {
    const response = await api.get(`/vehicles/${vehicleId}/locations`);
    return response.data;
}
    export default api;
