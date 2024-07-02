import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const API_URL = '/modelVehicles';

export const getAllModelVehicles = () => axios.get(`${API_URL}/getAll`);
export const getModelVehicleByBrand = (brandId) => axios.get(`${API_URL}/getByBrand/${brandId}`);
export const createModelVehicle = (vehicle) => axios.post(`${API_URL}/insert`, vehicle);
export const updateModelVehicle = (vehicle) => axios.put(`${API_URL}/update`, vehicle);
export const deleteModelVehicle = (id) => axios.delete(`${API_URL}/${id}`);
