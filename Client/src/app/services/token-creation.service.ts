import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenCaching } from '../models/token-caching';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenCreationService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  addTokenCaching(tokenCaching: TokenCaching): Observable<TokenCaching> {
    return this.http.post<TokenCaching>(`${this.baseUrl}/transaction`, tokenCaching);
  }

}
