import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import applicationService from '../services/applicationService';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getMyApplications(0, 5);
      const apps = response.data.content;
      setApplications(apps);

      // Calculate stats
      const statusCounts = apps.reduce((acc, app) => {
        acc[app.status.toLowerCase()] = (acc[app.status.toLowerCase()] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: apps.length,
        pending: statusCounts.pending || 0,
        shortlisted: statusCounts.shortlisted || 0,
        rejected: statusCounts.rejected || 0,
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      REVIEWED: 'bg-blue-100 text-blue-800',
      SHORTLISTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      ACCEPTED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      <h1 className="text-3xl font-bold mb-8">
        Welcome, {user?.user?.fullName || 'Candidate'}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Shortlisted</h3>
          <p className="text-3xl font-bold text-green-600">{stats.shortlisted}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => navigate('/jobs')}
          className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 text-left"
        >
          <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
          <p className="text-blue-100">Find your next opportunity</p>
        </button>
        <button
          onClick={() => navigate('/my-applications')}
          className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 text-left"
        >
          <h3 className="text-xl font-semibold mb-2">My Applications</h3>
          <p className="text-green-100">Track your applications</p>
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 text-left"
        >
          <h3 className="text-xl font-semibold mb-2">Update Profile</h3>
          <p className="text-purple-100">Keep your profile updated</p>
        </button>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Applications</h2>
          <button
            onClick={() => navigate('/my-applications')}
            className="text-blue-600 hover:underline"
          >
            View All →
          </button>
        </div>

        {applications.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No applications yet. Start applying to jobs!
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{app.jobTitle}</h3>
                    <p className="text-gray-600">{app.companyName}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied: {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
