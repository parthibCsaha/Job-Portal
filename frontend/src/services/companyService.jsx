import api from './api';

const companyService = {
  getAllCompanies: async (page = 0, size = 10) => {
    const response = await api.get(`/companies?page=${page}&size=${size}`);
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },
};

export default companyService;
