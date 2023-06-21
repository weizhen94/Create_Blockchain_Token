import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenCaching } from '../models/token-caching';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AddLiquidty } from '../models/add-liquidity';
import { Swap } from '../models/swap';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    console.log("jwt from token.service.ts:", token); 
    if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

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
    return this.http.put<any>(`${this.baseUrl}/resetPassword`, user);
  }

  checkUserExists(user: {email: string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/checkUserExists`, user);
  }
  
  addTokenCaching(tokenCaching: TokenCaching): Observable<TokenCaching> {
    const headers = this.getAuthHeaders();
    return this.http.post<TokenCaching>(`${this.baseUrl}/transaction`, tokenCaching, { headers });
  }

  addLiquidityCaching(addLiquidity: AddLiquidty): Observable<AddLiquidty> {
    const headers = this.getAuthHeaders();
    return this.http.post<AddLiquidty>(`${this.baseUrl}/addLiquidity`, addLiquidity, { headers });
  }

  addSwapCaching(swap: Swap): Observable<Swap> {
    const headers = this.getAuthHeaders();
    return this.http.post<Swap>(`${this.baseUrl}/addSwap`, swap, { headers });
  }

  getTransactionStatus(etherscanRequest: {txHash: string}): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/getTransactionStatus`, etherscanRequest, { headers });
  }  

  getTokensByEmail(email: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/getTokens?email=${email}`, { headers });
  }

  getLiquidityByEmail(email: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/getLiquidity?email=${email}`, { headers });
  }

  getSwapByEmail(email: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/getSwap?email=${email}`, { headers });
  }

}
