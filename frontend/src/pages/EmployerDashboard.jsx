import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jobService from '../services/jobService';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getMyJobs(0, 5);
      const jobsList = response.data.content;
      setJobs(jobsList);

      setStats({
        totalJobs: jobsList.length,
        openJobs: jobsList.filter(j => j.status === 'OPEN').length,
        totalApplications: jobsList.reduce((sum, j) => sum + (j.applicationsCount || 0), 0),
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold mb-8">Employer Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Jobs Posted</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Open Positions</h3>
          <p className="text-3xl font-bold text-green-600">{stats.openJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalApplications}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => navigate('/post-job')}
          className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 text-left"
        >
          <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
          <p className="text-blue-100">Create a new job listing</p>
        </button>
        <button
          onClick={() => navigate('/my-jobs')}
          className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 text-left"
        >
          <h3 className="text-xl font-semibold mb-2">Manage Jobs</h3>
          <p className="text-green-100">View and edit your listings</p>
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 text-left"
        >
          <h3 className="text-xl font-semibold mb-2">Company Profile</h3>
          <p className="text-purple-100">Update company information</p>
        </button>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Recent Jobs</h2>
          <button
            onClick={() => navigate('/my-jobs')}
            className="text-blue-600 hover:underline"
          >
            View All →
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No jobs posted yet</p>
            <button
              onClick={() => navigate('/post-job')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-600">{job.location} • {job.jobType?.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-2">
                      {job.applicationsCount || 0} Applications
                    </p>
                    <button
                      onClick={() => navigate(`/applicants/${job.id}`)}
                      className="text-blue-600 hover:underline text-sm mt-1"
                    >
                      View Applicants →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
