import api from './api';

const applicationService = {
  applyForJob: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  getMyApplications: async (page = 0, size = 10) => {
    const response = await api.get(`/applications/my-applications?page=${page}&size=${size}`);
    return response.data;
  },

  getJobApplications: async (jobId, page = 0, size = 10) => {
    const response = await api.get(`/applications/job/${jobId}?page=${page}&size=${size}`);
    return response.data;
  },

  updateApplicationStatus: async (id, status) => {
    const response = await api.put(`/applications/${id}/status?status=${status}`);
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
};

export default applicationService;
