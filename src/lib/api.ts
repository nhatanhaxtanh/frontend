import axios from 'axios'
import type { CarModel, TestDriveFormData, TestDriveRequest, LoginDto, AuthResponse, NewsPost } from './types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export const carModelApi = {
  getAll: () => api.get<CarModel[]>('/models'),
  getFeatured: () => api.get<CarModel[]>('/models/featured'),
  getBySlug: (slug: string) => api.get<CarModel>(`/models/${slug}`),
  create: (data: Partial<CarModel>) => api.post<CarModel>('/admin/models', data),
  update: (id: number, data: Partial<CarModel>) => api.put<CarModel>(`/admin/models/${id}`, data),
  delete: (id: number) => api.delete(`/admin/models/${id}`),
}

export const testDriveApi = {
  submit: (data: TestDriveFormData) => api.post('/test-drive', data),
  getAll: () => api.get<TestDriveRequest[]>('/admin/test-drives'),
  updateStatus: (id: number, status: string) =>
    api.put(`/admin/test-drives/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/admin/test-drives/${id}`),
}

export const newsApi = {
  getAll: () => api.get<NewsPost[]>('/news'),
  getBySlug: (slug: string) => api.get<NewsPost>(`/news/${slug}`),
  adminGetAll: () => api.get<NewsPost[]>('/admin/news'),
  create: (data: Partial<NewsPost>) => api.post<NewsPost>('/admin/news', data),
  update: (id: number, data: Partial<NewsPost>) => api.put<NewsPost>(`/admin/news/${id}`, data),
  delete: (id: number) => api.delete(`/admin/news/${id}`),
}

export const authApi = {
  login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export default api
