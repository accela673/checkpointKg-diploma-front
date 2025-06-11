import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'LANDLORD'>('CLIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${url}/api/auth/register/${role}`, {
        firstName,
        lastName,
        email,
        password,
      });
      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem('email', email);
        alert(t('register.successAlert'));
        navigate('/confirm-email');
      }
    } catch (error) {
      console.log(error);
      setError(t('register.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">{t('register.title')}</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="firstName" className="block font-medium">{t('register.firstName')}</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block font-medium">{t('register.lastName')}</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
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
          <label htmlFor="password" className="block font-medium">{t('register.password')}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block font-medium">{t('register.confirmPassword')}</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block font-medium">{t('register.role')}</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'CLIENT' | 'LANDLORD')}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="CLIENT">{t('register.client')}</option>
            <option value="LANDLORD">{t('register.landlord')}</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded transform transition duration-300 hover:scale-105 active:scale-95"
          disabled={loading}
        >
          {loading ? t('register.loading') : t('register.submit')}
        </button>
      </form>
    </div>
  );
};

export default Register;
