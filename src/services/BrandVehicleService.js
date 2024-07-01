import axios from 'axios';

const API_URL = '/brandVehicles';
  

export const getAllBrandVehicles = () => axios.get(`${API_URL}/getAll`);
export const createBrandVehicle = (vehicle) => axios.post(`${API_URL}/insert`, vehicle);
export const updateBrandVehicle = (vehicle) => axios.put(`${API_URL}/update/`, vehicle);
export const deleteBrandVehicle = (id) => axios.delete(`${API_URL}/${id}`);