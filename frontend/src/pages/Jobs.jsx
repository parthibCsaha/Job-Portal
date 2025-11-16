import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import jobService from '../services/jobService';

const Jobs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: '',
    experienceLevel: '',
    sortBy: 'postedDate',
    sortDir: 'DESC',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        size: pagination.size,
      };
      const response = await jobService.searchJobs(params);
      setJobs(response.data.content);
      setPagination({
        ...pagination,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 0 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Job Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>

          <select
            value={filters.experienceLevel}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">No jobs found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{job.company?.name}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.jobType?.replace('_', ' ')}</span>
                      {job.salaryRange && <span>💰 {job.salaryRange}</span>}
                    </div>
                    <p className="mt-3 text-gray-700 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {job.experienceLevel}
                    </span>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className={`px-4 py-2 rounded-lg ${
                    pagination.page === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages - 1}
                className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;