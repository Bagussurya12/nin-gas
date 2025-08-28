import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Buat Axios instance dengan baseURL
    this.api = axios.create({
      baseURL: environment.api_url, // contoh: http://localhost:3000/api
    });

    // Tambahkan interceptor request untuk JWT
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(environment.access_token_key);
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
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
