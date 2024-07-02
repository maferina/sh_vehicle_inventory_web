import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const API_URL = '/auth';

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; 
  } catch (error) {
    console.error('Error en login:', error.message);
    throw error; 
  }
};
