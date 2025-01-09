import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class ApiOverviewService {

  constructor(private http: HttpClient) {}
  
  getEndPointDetails(id: any) {
    const userId = localStorage.getItem('userid') || '';
    const headers = new HttpHeaders({
      'consumerId': userId
    });
    return this.http.get(urls.getApiByConsumerId+`?apiId=${id}`, { headers });
  }

  getSwagger(id:any){
    return this.http.get(urls.openApiSpecFileGetting+`?apiId=${id}`)
  }

  
}
