import axios from 'axios';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

// buat instance axios
const api = axios.create({
  baseURL: environment.api_url,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    if (res && res.data?.message === 'ACCESS_TOKEN_EXPIRED') {
      Swal.fire({
        icon: 'warning',
        title: 'Sesi Habis',
        text: 'Sesi Anda sudah habis, silakan login kembali.',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        // hapus token
        localStorage.removeItem('accessToken');
        // redirect ke halaman login
        window.location.href = '/login';
      });
    }
    return Promise.reject(error);
  }
);

export default api;
