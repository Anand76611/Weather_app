import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Using environment variable for flexibility

export const signUpUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error.response || error.message);
    return { message: error.response?.data?.message || 'An error occurred during sign up' };
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error.response || error.message);
    return { message: error.response?.data?.message || 'An error occurred during login' };
  }
};

export const getWeather = async (city, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/weather`,
      { city },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.response || error.message);
    return { message: error.response?.data?.message || 'Failed to fetch weather data' };
  }
};
