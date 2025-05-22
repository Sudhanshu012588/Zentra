import React, { useEffect, useState } from 'react';
import { Loader2, Mail, Lock, XCircle,Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useStore } from '../../store/Store';
import { useNavigate } from 'react-router-dom';
const ZenithLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
        const [showPassword, setShowPassword] = useState(false);
    
        const user = useStore((state)=>state.User)
        const setUser = useStore((state)=>state.setUser)
       
       
    //    useEffect(() => {
    //              console.log("Data wala",user)


    //    }, [user])
       
       const navigate = useNavigate()
const fetchUser = async (AccessToken) => {
  try {
    const verifyresponse = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}user/verify`,
      {}, // empty body, or send any data if needed
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,   // pass token in headers
        },
      }
    );

    

    if (verifyresponse.data.status === "Verified") {
      const userData = verifyresponse.data.user; // make sure user data is here
    //   console.log("req",userData)
      setUser({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          isLoggedIn: true,
          profilephoto:userData.profilephoto
        });
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  } catch (error) {
    toast.error("Error in fetchUser:", error);
    navigate('/login');
  }
};

useEffect(() => {
  const AccessToken = localStorage.getItem("AccessToken");
 
  if (AccessToken) {
    fetchUser(AccessToken);
  }
}, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email || !password) {
            toast.error('Please fill all fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_BASE_URL}user/login`,
                { email, password }
            );
            toast.success(response.data.message || 'Login successful!');
            localStorage.setItem("AccessToken",response.data.accesstoken)
            // console.log("res",response.data)
            setUser({
                name:response.data.user.name,
                isLoggedIn:true,
                email:response.data.user.name,
                profilephoto:response.data.profilephoto,
                coverImage:response.data.coverimage
            })
            // optionally redirect or update state
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Login failed!';
            toast.error(errMsg);
            setError(errMsg);
        } finally {
            setIsLoading(false);
            navigate('/dashboard')
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
  <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-lg hover:shadow-purple-600/40 transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-white flex items-center justify-center gap-3">
        <span className="text-purple-400 tracking-wide">Zenith</span>
        <span className="text-gray-300">Login</span>
      </h2>
      <p className="text-gray-400 mt-2 text-base font-medium">
        Welcome back! Please log in to your account.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <label
          htmlFor="email"
          className="text-gray-300 flex items-center gap-3 font-semibold text-sm"
        >
          <Mail className="w-5 h-5" /> Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full bg-black/25 text-white border border-purple-600 rounded-xl px-5 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-60 transition"
          autoComplete="email"
        />
      </div>

      <div className="space-y-3 relative">
        <label
          htmlFor="password"
          className="text-gray-300 flex items-center gap-3 font-semibold text-sm"
        >
          <Lock className="w-5 h-5" /> Password
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full bg-black/25 text-white border border-purple-600 rounded-xl px-5 py-3 placeholder:text-gray-500 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-60 transition"
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
        >
          {showPassword ? (
            <EyeOff className="w-6 h-6" />
          ) : (
            <Eye className="w-6 h-6" />
          )}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600/20 text-red-400 p-4 rounded-lg border border-red-500 flex items-center gap-3 text-sm font-medium"
          role="alert"
        >
          <XCircle className="w-6 h-6 flex-shrink-0" /> {error}
        </motion.div>
      )}

      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-4 rounded-3xl flex items-center justify-center gap-3 font-semibold text-lg shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-70"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" /> Logging In...
          </>
        ) : (
          'Log In'
        )}
      </button>

      <div className="text-center text-gray-400 text-sm mt-4 font-medium">
        Don&apos;t have an account?{' '}
        <a
          href="/signup"
          className="text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
        >
          Sign up
        </a>
      </div>
    </form>
  </div>
</div>

    );
};

export default ZenithLogin;
