import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenCaching } from '../models/token-caching';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  sendOTP(user: {email: string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/send-otp`, user);
  }
  
  verifyOTP(otp: {email: string, otp: string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-otp`, otp);
  }
  
  loginUser(user: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user);
  }
  
  registerUser(user: {email: string, password: string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  resetPassword(user: {email: string, password: string}): Observable<any> {
    console.log('from reset-password service: ', user.email, user.password);
    return this.http.post<any>(`${this.baseUrl}/resetPassword`, user);
  }

  checkUserExists(user: {email: string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/checkUserExists`, user);
  }
  
  addTokenCaching(tokenCaching: TokenCaching): Observable<TokenCaching> {
    return this.http.post<TokenCaching>(`${this.baseUrl}/transaction`, tokenCaching);
  }

}
