import axios from 'axios';
import type { Car, Enquiry, ApiResponse, CarFilters } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auto-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auto-token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err.response?.data || err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const loginAdmin = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

export const getMe = () =>
  api.get('/auth/me').then(r => r.data);

export const changePassword = (currentPassword: string, newPassword: string) =>
  api.put('/auth/change-password', { currentPassword, newPassword }).then(r => r.data);

export const updateProfile = (data: { name: string; email: string }) =>
  api.put('/auth/update-profile', data).then(r => r.data);

// ── CARS ──────────────────────────────────────────────────────────────────────
export const fetchCars = (filters?: Partial<CarFilters> & { page?: number; limit?: number; featured?: boolean }) =>
  api.get<ApiResponse<Car[]>>('/cars', { params: filters }).then(r => r.data);

export const fetchCarById = (id: string) =>
  api.get<ApiResponse<Car>>(`/cars/${id}`).then(r => r.data);

export const fetchFeaturedCars = () =>
  api.get<ApiResponse<Car[]>>('/cars?featured=true&limit=6').then(r => r.data);

export const createCar = (data: Partial<Car>) =>
  api.post<ApiResponse<Car>>('/cars', data).then(r => r.data);

export const updateCar = (id: string, data: Partial<Car>) =>
  api.put<ApiResponse<Car>>(`/cars/${id}`, data).then(r => r.data);

export const deleteCar = (id: string) =>
  api.delete(`/cars/${id}`).then(r => r.data);

// ── ENQUIRIES ─────────────────────────────────────────────────────────────────
export const submitEnquiry = (data: Partial<Enquiry>) =>
  api.post('/enquiries', data).then(r => r.data);

export const fetchEnquiries = () =>
  api.get<ApiResponse<Enquiry[]>>('/enquiries').then(r => r.data);

export const markEnquiryRead = (id: string) =>
  api.patch(`/enquiries/${id}/read`).then(r => r.data);

export const deleteEnquiry = (id: string) =>
  api.delete(`/enquiries/${id}`).then(r => r.data);

export default api;
