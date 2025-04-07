// src/pages/ConfirmEmail.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmEmail: React.FC = () => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');  // Получаем email из localStorage
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timer, setTimer] = useState(60); // Таймер для кнопки отправки
  const navigate = useNavigate();

  // Функция подтверждения email
  const handleConfirmEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/confirmEmail', { email, code });
      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        alert(`Аккаунт активирован успешно!`);
        navigate('/login');  // Перенаправление на страницу входа
      }
    } catch (error) {
      console.log(error)
      setError('Ошибка при подтверждении email');
    } finally {
      setLoading(false);
    }
  };

  // Функция для повторной отправки кода
  const handleResendCode = async () => {
    if (timer > 0) return;  // Если таймер не 0, то не отправляем код

    setResendLoading(true);
    setResendSuccess(false);
    setError('');

    try {
      const response = await axios.patch('http://localhost:5000/api/auth/sendCodeAgain', { email });
      if (response.status >= 200 && response.status < 300) {
        setResendSuccess(true);
        alert(`Код отправлен заново на имейл ${email}`);
        window.location.reload();  // Сброс таймера на 60 секунд после успешной отправки
      }
    } catch (error) {
      console.log(error)
      setError('Ошибка при повторной отправке кода');
    } finally {
      setResendLoading(false);
    }
  };

  // Таймер для кнопки
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Подтверждение email</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">Аккаунт успешно подтвержден!</p>}
      {resendSuccess && <p className="text-green-500 text-center">Код отправлен заново!</p>}

      <form onSubmit={handleConfirmEmail} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="code" className="block font-medium">Код подтверждения</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded transform transition duration-300 hover:scale-105 active:scale-95"
          disabled={loading}
        >
          {loading ? 'Подтверждение...' : 'Подтвердить email'}
        </button>
      </form>

      <button
        onClick={handleResendCode}
        className="w-full bg-gray-500 text-white mt-4 p-2 rounded transform transition duration-300 hover:scale-105 active:scale-95"
        disabled={resendLoading || timer > 0}
      >
        {resendLoading ? 'Отправка...' : timer > 0 ? `Отправить код снова (${timer}s)` : 'Отправить код заново'}
      </button>
    </div>
  );
};

export default ConfirmEmail;
