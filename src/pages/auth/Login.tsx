import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${url}/api/auth/login`, { email, password });
      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('role', response.data.role); 
        localStorage.setItem('id', response.data.id); 
        const currentTime = Date.now();
        localStorage.setItem("loginTime", currentTime.toString());
        alert(t('login.successAlert'));
        navigate('/profile');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">{t('login.title')}</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">{t('login.emailLabel')}</label>
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
          <label htmlFor="password" className="block font-medium">{t('login.passwordLabel')}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded transform transition duration-300 hover:scale-105 active:scale-95"
          disabled={loading}
        >
          {loading ? t('login.loading') : t('login.submit')}
        </button>
      </form>
    </div>
  );
};

export default Login;
