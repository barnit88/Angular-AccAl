import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

const apiPath = 'https://sb.api.accally.com/'; // read this from env file, for prod and dev

@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
  http = inject(HttpClient);

  private hello = 'hello';

  /**
   *
   */
  getForm(slug: string) {
    let params = new HttpParams();
    params = params.append('slug', slug);
    return this.http.get(apiPath + 'form/', { params: params });
  }

  getIntegrations() {
    return this.http.get(apiPath + 'integration/all/');
  }

  saveIntegration(path: string, data: any) {
    return this.http.post(apiPath + path, data);
  }

  deleteIntegration(slug: string) {
    let params = new HttpParams();
    params = params.append('slug', slug);
    return this.http.delete(apiPath + 'integration/remove/', { params: params });
  }

  getUsers() {
    return this.http.get(apiPath + 'user/all/');
  }
}
