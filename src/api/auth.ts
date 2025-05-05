import axios from 'axios';

// Получаем базовый URL из переменных окружения
const url = import.meta.env.VITE_URL;

// Типы для данных пользователя
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface EmailConfirmationData {
  email: string;
  code: string;
}

// Регистрация пользователя
export const registerUser = async (role: string, userData: UserData) => {
  try {
    const response = await axios.post(`${url}/api/register/${role}`, userData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Ошибка axios
      console.error('Registration error:', error);
      throw error.response?.data || error.message;
    }
    // Если ошибка не axios, выбрасываем её
    throw new Error('An unknown error occurred during registration');
  }
};

// Логин
export const loginUser = async ({ email, password }: LoginData) => {
  try {
    const response = await axios.post(`${url}/api/login`, { email, password });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error);
      throw error.response?.data || error.message;
    }
    throw new Error('An unknown error occurred during login');
  }
};

// Подтверждение email
export const confirmEmail = async ({ email, code }: EmailConfirmationData) => {
  try {
    const response = await axios.post(`${url}/api/confirmEmail`, { email, code });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Email confirmation error:', error);
      throw error.response?.data || error.message;
    }
    throw new Error('An unknown error occurred during email confirmation');
  }
};