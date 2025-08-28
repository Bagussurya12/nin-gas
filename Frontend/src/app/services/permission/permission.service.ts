import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  permissions:any = [];

  constructor() { }

  async getPermissions() {
    const accessToken = window.localStorage.getItem(environment.api_token_identifier);
    if (accessToken && accessToken !== undefined && accessToken !== null && accessToken !== '' && this.permissions.length <= 0) {
      let url = `${environment.api_url}/get-permissions`;
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": 'application/json',
            Accept: 'application/json'
          }
        });
        const data = await res.data;
        // get permissions
        this.permissions = data.permissions;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async removePermissions () {
    this.permissions = [];
  }

  hasPermission (permission:string) {
    if (permission !== null
        && permission !== undefined
        && permission !== ''
        && this.permissions.includes(permission)
      ) {
        return true;
    }
    return false;
  }
}