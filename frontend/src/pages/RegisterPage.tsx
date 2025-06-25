import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    if (!email || !confirmEmail || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (email !== confirmEmail) {
      setErrorMsg('Email and Confirm Email do not match');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await axios.post('/auth/register', { email, password });
      const res = await axios.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>

        <input
          type="email"
          className="w-full border px-4 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="email"
          className="w-full border px-4 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm Email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-4 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={register}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center mt-3">{errorMsg}</p>
        )}

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
