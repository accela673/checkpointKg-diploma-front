import React from 'react';

interface AuthFormProps {
  type: 'login' | 'register';
  formData: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler;
  loading: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, formData, onChange, onSubmit, loading, error }) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{type === 'register' ? 'Регистрация' : 'Вход'}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block">Имя</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block">Фамилия</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block">Пароль</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
                type="submit"
                className={`w-full p-2 rounded transition-all duration-300 ease-in-out transform ${
                 loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95 text-white"
                }`}
                 disabled={loading}
                >
                 {loading ? "Загрузка..." : type === "register" ? "Зарегистрироваться" : "Войти"}
        </button>

      </form>
    </div>
  );
};

export default AuthForm;
