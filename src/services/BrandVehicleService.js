import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const API_URL = '/brandVehicles';
  

export const getAllBrandVehicles = () => axios.get(`${API_URL}/getAll`);
export const createBrandVehicle = (vehicle) => axios.post(`${API_URL}/insert`, vehicle);
export const updateBrandVehicle = (vehicle) => axios.put(`${API_URL}/update/`, vehicle);
export const deleteBrandVehicle = (id) => axios.delete(`${API_URL}/${id}`);