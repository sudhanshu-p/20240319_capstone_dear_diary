import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadFmcTokenService {

  constructor(private http:HttpClient) { }
  jwt:string|null = localStorage.getItem('token')
  getToken(fmcToken:string){
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      Authorization: `Bearer ${this.jwt}`
    })
    return this.http.put(`http://localhost:3000/users`,{fmcToken:fmcToken},{headers:headers})
  }
}
