import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'token';
  constructor(
    private cookieServ: CookieService
  ) { }


  get token() {
    return this.cookieServ.get(this.tokenKey);
  }
  set token(token) {
    console.log(token)
    this.cookieServ.set(this.tokenKey, token, 365);
  }
}
