// src/pages/ConfirmEmail.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ConfirmEmail: React.FC = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  const handleConfirmEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${url}/api/auth/confirmEmail`, { email, code });
      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        alert(t('confirmEmail.accountActivated'));
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      setError(t('confirmEmail.confirmError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;

    setResendLoading(true);
    setResendSuccess(false);
    setError('');

    try {
      const response = await axios.patch(`${url}/api/auth/sendCodeAgain`, { email });
      if (response.status >= 200 && response.status < 300) {
        setResendSuccess(true);
        alert(t('confirmEmail.codeResent', { email }));
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setError(t('confirmEmail.resendError'));
    } finally {
      setResendLoading(false);
    }
  };

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
      <h2 className="text-2xl font-bold text-center mb-4">{t('confirmEmail.title')}</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{t('confirmEmail.success')}</p>}
      {resendSuccess && <p className="text-green-500 text-center">{t('confirmEmail.codeResentMessage')}</p>}

      <form onSubmit={handleConfirmEmail} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">{t('confirmEmail.emailLabel')}</label>
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
          <label htmlFor="code" className="block font-medium">{t('confirmEmail.codeLabel')}</label>
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
          {loading ? t('confirmEmail.confirming') : t('confirmEmail.confirmButton')}
        </button>
      </form>

      <button
        onClick={handleResendCode}
        className="w-full bg-gray-500 text-white mt-4 p-2 rounded transform transition duration-300 hover:scale-105 active:scale-95"
        disabled={resendLoading || timer > 0}
      >
        {resendLoading
          ? t('confirmEmail.sending')
          : timer > 0
          ? t('confirmEmail.resendIn', { seconds: timer })
          : t('confirmEmail.resendButton')}
      </button>
    </div>
  );
};

export default ConfirmEmail;
