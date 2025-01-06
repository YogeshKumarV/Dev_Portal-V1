import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiProductsService {

  constructor(private http: HttpClient) {
    
   }
   getApplication(consumerId: any,pageNo:number,pageSize:number): Observable<any> {
    const headers = {
      consumerId: consumerId
    }
    const options: any = { headers: headers }
    // const getAppUrls = urls.getApplications + "?pageNo=0&pageSize=10"
    // const url = `${urls.getEndpointCards}?pageNo=${pageNo}&pageSize=${pageSize}`;
    const getAppUrls= `${urls.getApplications}?pageNo=${pageNo}&pageSize=${pageSize}`
    return this.http.post(getAppUrls, null, options)
  }

  private apiproductData: ReplaySubject<string> = new ReplaySubject<string>(1);
 
  setApiproductData(data: any): void {
    this.apiproductData.next(data);
  }
 
  getApiproductData$(): Observable<any> {
    return this.apiproductData.asObservable();
  }
}
