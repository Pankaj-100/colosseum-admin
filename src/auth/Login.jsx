import { Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/api';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../component/Spinner';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const dispatch = useDispatch();
  const { error, errorMessage, loading, admin } = useSelector((state) => state.auth);
  const user = localStorage.getItem('admin');
  const navigate = useNavigate();

  useEffect(() => {
    if (user || admin) {
      navigate('/dashboard');
    }
  }, [admin]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = () => {
    setTouched(true);
    const isValidEmail = validateEmail(email);
    setEmailValid(isValidEmail);

    if (!email || !password || !isValidEmail) return;

    login(dispatch, { email, password });
  };

  const emailError = (!email || !emailValid) && touched;
  const passwordError = !password && touched;

  // Display error toast from backend error
  useEffect(() => {
    if (error && errorMessage) {
      message.error(errorMessage); // Show error message as toast
    }
  }, [error, errorMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">COLOSSEUM Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Login to manage the platform</p>
        </div>

        <div className="space-y-5">
          <div>
            <Input
              placeholder="Email"
              type="email"
              size="large"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              status={emailError ? 'error' : ''}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">
                {email ? 'Enter a valid email address' : 'Email is required'}
              </p>
            )}
          </div>

          <div>
            <Input.Password
              placeholder="Password"
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              status={passwordError ? 'error' : ''}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">Password is required</p>
            )}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-150 font-semibold text-sm"
            disabled={loading}
          >
            {loading ? <Spinner size={20} /> : 'Login'}
          </button>

      
        </div>
      </div>
    </div>
  );
}

export default Login;
