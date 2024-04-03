import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserService {

  constructor(private http:HttpClient) { }
  token:string|null = localStorage.getItem('token')
  update(userData:any){
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      Authorization:`Bearer ${this.token}`
    })
    return this.http.put(`http://localhost:3000/users`,userData,{headers:headers})

  }
}
