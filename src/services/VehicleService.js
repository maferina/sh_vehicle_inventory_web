import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const API_URL = '/vehicles';

export const getAllVehicles = (filters) => {
    const params = {
        ...filters,
        offset: filters.page ? (filters.page - 1) * filters.limit : 0,
        limit: filters.limit || 15
    };

    return axios.get(`${API_URL}/getAll`, { params });
};

export const getVehicleId = (id) => axios.get(`${API_URL}/${id}`);

export const createVehicle = async (vehicle) => {
    try {
        const response = await axios.post(`${API_URL}/insert`, vehicle);
        return response;
    } catch (error) {
        throw error; 
    }
};

// Servicio para actualizar un vehículo
export const updateVehicle = async (vehicle) => {
    try {
        const response = await axios.put(`${API_URL}/update`, vehicle);
        return response;
    } catch (error) {
        throw error; // Re-lanzar el error para manejarlo en el frontend
    }
};
export const deleteVehicle = (id) => axios.delete(`${API_URL}/${id}`);