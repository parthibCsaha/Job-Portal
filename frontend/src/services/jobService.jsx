import api from './api';

const jobService = {
  getAllJobs: async (page = 0, size = 10) => {
    const response = await api.get(`/jobs?page=${page}&size=${size}`);
    return response.data;
  },

  searchJobs: async (filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const response = await api.get(`/jobs/search?${params.toString()}`);
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getMyJobs: async (page = 0, size = 10) => {
    const response = await api.get(`/jobs/my-jobs?page=${page}&size=${size}`);
    return response.data;
  },
};

export default jobService;