import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobService.getJobById(id);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    setError('');

    try {
      await applicationService.applyForJob({
        jobId: parseInt(id),
        coverLetter,
      });
      alert('Application submitted successfully!');
      setShowApplyModal(false);
      navigate('/my-applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Job not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-6"
      >
        ← Back to Jobs
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600">{job.company?.name}</p>
          </div>
          {isCandidate && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Apply Now
            </button>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Location:</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Job Type:</span>
            <span>{job.jobType?.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Experience:</span>
            <span>{job.experienceLevel}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold">Salary:</span>
              <span>{job.salaryRange}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Posted:</span>
            <span>{new Date(job.postedDate).toLocaleDateString()}</span>
          </div>
          {job.closingDate && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold">Closing Date:</span>
              <span>{new Date(job.closingDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
          </div>
        )}

        {/* Company Info */}
        {job.company && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">About {job.company.name}</h2>
            <p className="text-gray-700">{job.company.description}</p>
            {job.company.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Visit Company Website →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                rows="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us why you're a great fit for this position..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying || !coverLetter.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;