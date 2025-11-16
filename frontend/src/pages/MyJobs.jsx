import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getMyJobs(0, 50);
      setJobs(response.data.content);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(jobId);
        setJobs(jobs.filter(job => job.id !== jobId));
      } catch (error) {
        alert('Failed to delete job');
      }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <button
          onClick={() => navigate('/post-job')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-600 mt-1">
                    {job.location} • {job.jobType?.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    {job.applicationsCount || 0} Applications
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => navigate(`/applicants/${job.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View Applicants
                </button>
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View Job
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
