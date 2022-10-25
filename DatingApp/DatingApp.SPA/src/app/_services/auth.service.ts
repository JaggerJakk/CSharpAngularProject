import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://localhost:5000/api/auth';
  userToken: string;
  decodedToken: any;

  constructor(private http: HttpClient,
              public jwtHelper: JwtHelperService) { }

  login(model: any) {
    return this.http.post<{ tokenString: string }>(this.baseUrl + '/login', model, this.requestOptions(model)).pipe(
      map((res) => {
        const user = res;
        if (user) {
          localStorage.setItem('token', user.tokenString);
          this.decodedToken = this.jwtHelper.decodeToken(user.tokenString)
          this.userToken = user.tokenString;
        }
      }),
      catchError(this.handleError)
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + '/register', model, this.requestOptions(model)).pipe(catchError(this.handleError));
  }

  loggedIn()
  {
    return !this.jwtHelper.isTokenExpired(this.userToken);
  }

  private requestOptions(model: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, params: model };
    return options;
  }

  private handleError(error: any) {
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      return throwError(applicationError);
    }

    const serverError = error.error;
    let modelStateErrors = '';

    if (serverError) {
      if (typeof serverError === 'string')
        modelStateErrors = serverError;
      else {
        for (const key in serverError) {
          if (serverError[key]) {
            modelStateErrors += serverError[key] + '\n';
          }
        }
      }
    }
    
    return throwError(modelStateErrors || 'Server error');
  }
}
