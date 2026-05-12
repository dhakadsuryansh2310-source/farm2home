import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'consumer'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data, res.data.token);
      if (res.data.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-light">
      <div className="max-w-md w-full card p-8">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Join Farm2Table
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" type="text" required className="input-field" value={formData.name} onChange={handleChange} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input name="email" type="email" required className="input-field" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phone" type="text" className="input-field" value={formData.phone} onChange={handleChange} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" required className="input-field" value={formData.password} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I want to:</label>
            <select name="role" className="input-field bg-white" value={formData.role} onChange={handleChange}>
              <option value="consumer">Buy Fresh Produce</option>
              <option value="farmer">Sell My Harvest</option>
            </select>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full btn-primary flex justify-center py-3">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
