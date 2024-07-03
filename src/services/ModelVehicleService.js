import axios from 'axios';

const API_URL = '/modelVehicles';

export const getAllModelVehicles = () => axios.get(`${API_URL}/getAll`);
export const getModelVehicleByBrand = (brandId) => axios.get(`${API_URL}/getByBrand/${brandId}`);
export const createModelVehicle = (vehicle) => axios.post(`${API_URL}/insert`, vehicle);
export const updateModelVehicle = (vehicle) => axios.put(`${API_URL}/update`, vehicle);
export const deleteModelVehicle = (id) => axios.delete(`${API_URL}/${id}`);
