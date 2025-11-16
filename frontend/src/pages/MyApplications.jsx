import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import applicationService from '../services/applicationService';

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getMyApplications(0, 50);
      setApplications(response.data.content);
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

  const filteredApplications = filter === 'ALL' 
    ? applications 
    : applications.filter(app => app.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">No applications found</p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-600 mb-1">
                    {app.jobTitle}
                  </h3>
                  <p className="text-gray-600 mb-2">{app.companyName}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                    <span>Updated: {new Date(app.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => navigate(`/jobs/${app.jobId}`)}
                    className="block mt-3 text-blue-600 hover:underline text-sm"
                  >
                    View Job →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
