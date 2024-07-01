import axios from 'axios';

const API_URL = '/users';


export const getAllUsers = (filters) => {
    const params = {
        ...filters,
        offset: filters.page ? (filters.page - 1) * filters.limit : 0,
        limit: filters.limit || 15
    };
    return axios.get(`${API_URL}/getAll`, { params });
};


export const createUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/insert`, user);
        return response;
    } catch (error) {
        throw error; 
    }
};


export const updateUser = async (user) => {
    try {
        const response = await axios.put(`${API_URL}/update`, user);
        return response;
    } catch (error) {
        throw error; 
    }
};
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);