import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: environment.api_url,
    });

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

  public get(url: string, params: any = {}) {
    return this.api.get(url, { params });
  }

  public post(url: string, data: any = {}, headers: any = {}) {
    return this.api.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data', ...headers },
    });
  }

  public put(url: string, data: any = {}, headers: any = {}) {
    return this.api.put(url, data, { headers });
  }

  public delete(url: string, headers: any = {}) {
    return this.api.delete(url, { headers });
  }
}
