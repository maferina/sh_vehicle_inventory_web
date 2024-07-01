import axios from 'axios';

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
