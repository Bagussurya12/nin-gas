import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api: AxiosInstance;

  constructor() {
    // buat instance axios
    this.api = axios.create({
      baseURL: environment.api_url,
    });

    // Request interceptor: attach token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(environment.access_token_key);
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle token expired
    this.api.interceptors.response.use(
      (response) => response, // response sukses
      (error) => {
        const res = error.response;

        if (res) {
          // jika token expired
          if (res.data?.message === 'ACCESS_TOKEN_EXPIRED') {
            Swal.fire({
              title: '<strong>Sesi Anda Habis!</strong>',
              html: '<p>Sesi Anda sudah habis, silakan login kembali.</p>',
              icon: 'warning',
              confirmButtonText: 'Login Sekarang',
              confirmButtonColor: '#001A6E',
              background: '#f0f4f8',
              color: '#000000',
              showClass: {
                popup: 'animate__animated animate__fadeInDown',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
              },
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then(() => {
              localStorage.removeItem(environment.access_token_key);
              localStorage.removeItem(environment.refresh_token_key);
              window.location.href = '/login';
            });
          }
        } else {
          // network error / backend mati
          console.error('Tidak bisa connect ke backend:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  // GET request
  public get(url: string, params: any = {}) {
    return this.api.get(url, { params });
  }

  // POST request
  public post(url: string, data: any = {}, headers: any = {}) {
    return this.api.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data', ...headers },
    });
  }

  // PUT request
  public put(url: string, data: any = {}, headers: any = {}) {
    return this.api.put(url, data, { headers });
  }

  // DELETE request
  public delete(url: string, headers: any = {}) {
    return this.api.delete(url, { headers });
  }
}
