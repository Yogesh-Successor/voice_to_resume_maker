import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Resume API
export const resumeAPI = {
  create: (data) => api.post('/api/resumes', data),
  getAll: () => api.get('/api/resumes'),
  getById: (id) => api.get(`/api/resumes/${id}`),
  update: (id, data) => api.put(`/api/resumes/${id}`, data),
  delete: (id) => api.delete(`/api/resumes/${id}`),
  addTranscription: (id, text) => api.post(`/api/resumes/${id}/transcriptions`, { text }),
};

// AI API
export const aiAPI = {
  processVoice: (speechText) => api.post('/api/ai/process-voice', { speechText }),
  enhanceResume: (resumeId, additionalSpeech) => 
    api.post('/api/ai/enhance-resume', { resumeId, additionalSpeech }),
  testConnection: () => api.get('/api/ai/test-connection'),
};

// Template API
export const templateAPI = {
  getAll: () => api.get('/api/templates'),
  getById: (id) => api.get(`/api/templates/${id}`),
  initialize: () => api.post('/api/templates/initialize'),
};

// Export API
export const exportAPI = {
  exportPDF: (resumeId, htmlContent) => 
    api.post('/api/export/pdf', { resumeId, htmlContent }, { responseType: 'blob' }),
  exportWord: (resumeId) => 
    api.post('/api/export/word', { resumeId }, { responseType: 'blob' }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;

