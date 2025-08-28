import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  async login(username: string, password: string): Promise<void> {
    const res = await axios.post(
      `${environment.api_url}/login`,
      {
        username,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    localStorage.setItem(environment.access_token_key, res.data.accessToken);
    localStorage.setItem(environment.refresh_token_key, res.data.refreshToken);
  }

  logout() {
    localStorage.removeItem(environment.access_token_key);
    localStorage.removeItem(environment.refresh_token_key);
    window.location.href = '/login';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(environment.access_token_key);
  }
}
