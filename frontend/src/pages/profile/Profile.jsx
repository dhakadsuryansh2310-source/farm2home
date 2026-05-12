import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Phone, Mail, Shield, Save, X } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'zipCode'].includes(name)) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', formData);
      updateUser({ ...user, ...res.data });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card overflow-hidden">
          {/* Cover Header */}
          <div className="h-32 bg-primary-600 w-full relative">
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg text-primary-600 text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || <User size={40} />}
              </div>
            </div>
          </div>
          
          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-dark">{t('profile_title')}</h1>
                <p className="text-gray-500 capitalize flex items-center gap-2 mt-1">
                  <Shield size={16} className={user?.role === 'farmer' ? 'text-green-600' : 'text-blue-600'} />
                  {user?.role}
                </p>
              </div>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn-secondary">
                  {t('profile_edit')}
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-500 flex items-center gap-1">
                  <X size={18} /> {t('profile_cancel')}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 text-dark flex items-center gap-2">
                    <User size={18} className="text-primary-600" /> Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile_name')}</label>
                    <input 
                      type="text" 
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile_email')}</label>
                    <input 
                      type="email" 
                      name="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Phone size={14}/> {t('profile_phone')}</label>
                    <input 
                      type="tel" 
                      name="phone"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                </div>

                {/* Address Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 text-dark flex items-center gap-2">
                    <MapPin size={18} className="text-primary-600" /> Address Details
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile_address')}</label>
                    <input 
                      type="text" 
                      name="street"
                      disabled={!isEditing}
                      value={formData.address.street}
                      onChange={handleChange}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile_city')}</label>
                      <input 
                        type="text" 
                        name="city"
                        disabled={!isEditing}
                        value={formData.address.city}
                        onChange={handleChange}
                        className="input-field disabled:bg-gray-50 disabled:text-gray-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile_state')}</label>
                      <input 
                        type="text" 
                        name="state"
                        disabled={!isEditing}
                        value={formData.address.state}
                        onChange={handleChange}
                        className="input-field disabled:bg-gray-50 disabled:text-gray-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile_zip')}</label>
                    <input 
                      type="text" 
                      name="zipCode"
                      disabled={!isEditing}
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Save size={18} /> {loading ? 'Saving...' : t('profile_save')}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
