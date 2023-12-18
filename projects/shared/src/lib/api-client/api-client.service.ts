import { Injectable, inject } from '@angular/core';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { EnvironmentVarService } from '../environment-var.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

enum Method {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

type RequestData = { [key: string]: any };
type RequestParams = RequestData;

type ErrorData = {
  detail: string;
};

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private axios: AxiosInstance;

  private envVars = inject(EnvironmentVarService);
  private cookie = inject(CookieService);
  private auth = inject(AuthService);

  public baseUrl: string | null = null;

  constructor() {
    this.axios = this.createAxiosClient();
    console.log('Bruce URL', this.baseUrl);
  }

  createAxiosClient() {
    const env = this.envVars.ENVIRONMENT || 'production';

    if (env === 'sandbox') {
      this.baseUrl = localStorage.getItem('__server__') || this.envVars.BRUCE_URL;
    }

    return axios.create({
      baseURL: this.baseUrl || this.envVars.BRUCE_URL,
    });
  }

  updateAxiosClient(baseUrl: string) {
    if (baseUrl.trim()) {
      localStorage.setItem('__server__', baseUrl);
      this.baseUrl = baseUrl;
      this.axios = axios.create({
        baseURL: this.baseUrl,
      });
    }
  }

  get<T>(url: string, params?: RequestParams): Promise<T> {
    return this.requestHandler<T>(url, Method.GET, params);
  }

  delete<T>(url: string, params?: RequestParams): Promise<T> {
    return this.requestHandler<T>(url, Method.DELETE, params);
  }

  post<T>(url: string, data?: RequestParams): Promise<T> {
    return this.requestHandler<T>(url, Method.POST, data);
  }

  patch<T>(url: string, data?: RequestParams): Promise<T> {
    return this.requestHandler<T>(url, Method.PATCH, data);
  }

  private async requestHandler<T>(url: string, method: Method, data?: RequestData): Promise<T> {
    try {
      const response = await this.axios.request({
        url: url,
        headers: this.prepareHeader(),
        method: method,
        data: method === Method.POST ? data : null,
        params: [Method.GET, Method.DELETE].includes(method) ? data : null,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError<ErrorData>;

        throw {
          err: err.response?.data.detail || '',
        };
      } else {
        throw {
          err: 'Something went wrong!',
        };
      }
    }
  }

  private prepareHeader() {
    let header = {};
    const hasToken = this.auth.getCookies();

    if (hasToken) {
      const token = this.auth.getCookies() || '';
      header = {
        ...header,
        Authorization: `Bearer ${token}`,
      };
    }
    return header;
  }
}
