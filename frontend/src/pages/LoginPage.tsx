import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    setErrorMsg('');
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err: any) {
      let msg = 'Login failed. Please check your credentials.';

      if (Array.isArray(err.response?.data?.message)) {
        msg = err.response.data.message.join('\n');
      } else if (typeof err.response?.data?.message === 'string') {
        msg = err.response.data.message;
      }

      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Login</h1>

        <input
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
          <div className="text-red-500 text-sm mb-4 text-center whitespace-pre-line">
            {errorMsg}
          </div>
        )}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-4"
          onClick={login}
        >
          Sign In
        </button>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
