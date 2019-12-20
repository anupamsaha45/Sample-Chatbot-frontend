import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  url = environment.apiURL
  constructor(private http: HttpClient) { }

  createCompany(data) {
    return this.http.post(this.url + '/company', data).toPromise()
  }

  getCompanies() {
  	return this.http.get(this.url + '/company').toPromise()
  }
  
  updateUser(data) {
  	return this.http.put(this.url + '/user', data).toPromise()
  }

}