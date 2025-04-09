import axios from 'axios';

const url = import.meta.env.VITE_URL

// Регистрация пользователя
export const registerUser = async (role: string, userData: { firstName: string, lastName: string, email: string, password: string }) => {
  try {
    const response = await axios.post(`${url}/api/register/${role}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Логин
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${url}/api/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Подтверждение email
export const confirmEmail = async (email: string, code: string) => {
  try {
    const response = await axios.post(`${url}/api/confirmEmail`, { email, code });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
