import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class ApiOverviewService {

  constructor(private http: HttpClient) {}
  
  getEndPointDetails(id: any) {
    return this.http.get(urls.getApi+`?apiId=${id}`);
  }

  getSwagger(id:any){
    return this.http.get(urls.openApiSpecFileGetting+`?apiId=${id}`)
  }

  
}
