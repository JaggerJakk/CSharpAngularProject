import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://localhost:5000/api/auth';
  userToken: string;
  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post<{tokenString: string}>(this.baseUrl + '/login', model, this.requestOptions(model)).pipe(
      map((res) => {
        const user = res;
        if (user) {
          localStorage.setItem('token', user.tokenString);
          this.userToken = user.tokenString;
        }
      })
    );
  }

  register(model:any){
    return this.http.post(this.baseUrl + '/register', model, this.requestOptions(model));
   }

  private requestOptions(model:any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, params: model };
    return options;
  }
}
