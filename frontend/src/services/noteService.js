import axios from 'axios';

const API = 'http://localhost:3000/notes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getNotes = () => axios.get(API, getAuthHeaders());
export const getNote = (id) => axios.get(`${API}/${id}`, getAuthHeaders());
export const createNote = (data) => axios.post(API, data, getAuthHeaders());
export const updateNote = (id, data) => axios.patch(`${API}/${id}`, data, getAuthHeaders());
export const deleteNote = (id) => axios.delete(`${API}/${id}`, getAuthHeaders());
