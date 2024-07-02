import axios from 'axios';

const API_URL = '/auth';


export const login = async (userData) => {
  try {
    console.log('Axios base URL:', axios.defaults.baseURL)
    console.log('entro aqui login service')
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
