import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import applicationService from '../services/applicationService';
import jobService from '../services/jobService';

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobResponse, appsResponse] = await Promise.all([
        jobService.getJobById(jobId),
        applicationService.getJobApplications(jobId, 0, 100),
      ]);
      setJob(jobResponse.data);
      setApplications(appsResponse.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      alert('Failed to update status');
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
      <button
        onClick={() => navigate('/my-jobs')}
        className="text-blue-600 hover:underline mb-6"
      >
        ← Back to My Jobs
      </button>

      {job && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
          <p className="text-gray-600">{job.company?.name}</p>
          <p className="text-lg font-semibold text-blue-600 mt-4">
            {applications.length} Total Applications
          </p>
        </div>
      )}

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
            {status.replace('_', ' ')} ({applications.filter(a => status === 'ALL' || a.status === status).length})
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{app.candidateName}</h3>
                  <p className="text-gray-600">{app.candidateEmail}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>

              {app.coverLetter && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Cover Letter:</h4>
                  <p className="text-gray-700 whitespace-pre-line">{app.coverLetter}</p>
                </div>
              )}

              {app.resumeUrl && (
                <div className="mb-4">
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📄 View Resume
                  </a>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleStatusUpdate(app.id, 'REVIEWED')}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Mark as Reviewed
                </button>
                <button
                  onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                  className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;