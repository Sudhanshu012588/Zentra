import React, { useState } from 'react';
import { Loader2, User, Mail, Lock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/Store';

const ZenithSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const sendData = async (userPayload) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}user/signup`,
        userPayload
      );
      toast.success(response.data.message || 'Signup successful!');

      if (response.data.status === 'success') {
         localStorage.setItem('AccessToken', response.data.AccessToken);
         localStorage.setItem('RefreshToken', response.data.RefreshToken);

        // const verifyResponse = await axios.get(
        //   `${import.meta.env.VITE_BACKEND_BASE_URL}user/verify`,
        //   {
        //     headers: { Authorization: `Bearer ${response.data.AccessToken}` },
        //   }
        // );
        navigate('/dashboard');
        
        // if (verifyResponse.data.status === 'Verified') {
        //   setUser({
        //     id: response.data.user._id,
        //     name: response.data.user.name,
        //     email: response.data.user.email,
        //     isLoggedIn: true,
        //   });
        // } else {
        //   navigate('/login');
        // }

        setIsSuccess(true);
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || 'Signup failed!';
      setError(errMsg);
      toast.error(errMsg);
    }
    navigate('/login')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password) {
      toast.error('Please fill all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const userPayload = { name, email, password };

    await sendData(userPayload);
    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-2 pt-20 flex items-center justify-center">
        <div className="w-full max-w-md p-6 rounded-2xl">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl hover:scale-[1.01] hover:shadow-purple-500/20 transition-all duration-500">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                  <span className="text-purple-400">Zenith</span>
                  <span className="text-gray-300">Signup</span>
                </h2>
                <p className="text-gray-400">Create an account to join the community.</p>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="text-center p-6 bg-green-500/10 rounded-lg border border-green-500/20"
                >
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-300 mb-2">Signup Successful!</p>
                  <p className="text-gray-400">
                    Welcome to Zenith. Please check your email to confirm your account.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4" /> Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-black/20 text-white border border-purple-500/30 rounded px-4 py-2 placeholder:text-gray-500"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-black/20 text-white border border-purple-500/30 rounded px-4 py-2 placeholder:text-gray-500"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Password
                    </label>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-black/20 text-white border border-purple-500/30 rounded px-4 py-2 pr-10 placeholder:text-gray-500"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-[38px] mt-1 text-gray-400 hover:text-white"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="space-y-2 relative">
                    <label htmlFor="confirm-password" className="text-gray-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full bg-black/20 text-white border border-purple-500/30 rounded px-4 py-2 pr-10 placeholder:text-gray-500"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 mt-1 top-[38px] text-gray-400 hover:text-white"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 text-red-400 p-3 rounded-md border border-red-500/20 flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" /> {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-purple-500 text-white py-3 rounded-full hover:bg-purple-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Signing Up...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </button>

                  <div className="text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <a href="/login" className="text-purple-400 hover:underline">
                      Log in
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZenithSignup;
