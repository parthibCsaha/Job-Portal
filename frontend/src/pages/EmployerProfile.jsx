import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import companyService from '../services/companyService';

const EmployerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [companies, setCompanies] = useState([]);
  
  const [profileData, setProfileData] = useState({
    email: '',
    phone: '',
    position: '',
    companyId: '',
    companyName: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
    fetchCompanies();
  }, []);

  // In EmployerProfile.jsx - Update the fetchProfile function

const fetchProfile = async () => {
  try {
    console.log('🔍 Fetching profile...'); // Debug log
    const response = await userService.getCurrentProfile();
    console.log('✅ Profile response:', response); // Debug log
    
    setProfileData({
      email: response.data.email || '',
      phone: response.data.phone || '',
      position: response.data.position || '',
      companyId: response.data.companyId || '',
      companyName: response.data.companyName || '',
    });
    
    console.log('✅ Profile loaded successfully'); // Debug log
  } catch (err) {
    console.error('❌ Profile error:', err); // Debug log
    console.error('❌ Error response:', err.response); // Debug log
    setError('Failed to load profile: ' + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
  }
};

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getAllCompanies(0, 100);
      setCompanies(response.data.content);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updateData = {
        phone: profileData.phone,
        position: profileData.position,
      };
      
      if (profileData.companyId) {
        updateData.companyId = parseInt(profileData.companyId);
      }

      await userService.updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'personal'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'security'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Security
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Profile Information Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Position/Title
                </label>
                <input
                  type="text"
                  name="position"
                  value={profileData.position}
                  onChange={handleProfileChange}
                  placeholder="e.g., HR Manager"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Company
              </label>
              <select
                name="companyId"
                value={profileData.companyId}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {profileData.companyName && (
                <p className="text-sm text-gray-600 mt-1">
                  Current company: {profileData.companyName}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployerProfile;
