import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DatingApp.SPA';

  constructor(private authService: AuthService,
              public  jwtHelper: JwtHelperService){}

  ngOnInit(){
    const token = localStorage.getItem('token');
    if(token)
    {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }


}
