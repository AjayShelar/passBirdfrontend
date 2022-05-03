import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
const API_URL = environment.apiUrl;
const API_KEY = environment.apiKey;

// export class App {
//   id: string;
//   username: string;
//   applications: Array<Object>;
//   constructor(values: Object = {}) {
//     Object.assign(this, values);
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public token: string;

  constructor(private http: HttpClient) {
    this.token = API_KEY;
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json');
    headers.append('x-api-key', API_KEY);
  }

  postData( body:any): Observable<any[]> {
    return this.http.post<any[]>(API_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });
  }

  getData(params:HttpParams): Observable<any[]> {
    
    return this.http.get<any[]>(API_URL,  {
      params:params,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });
  }

  public createApp(app:object): Observable<any> {
    return this.postData(app);
  }


  public getApps(username:string): Observable<any[]> {
    const params = new HttpParams()
    .set('username', username)
    return this.getData( params);
  }


}
