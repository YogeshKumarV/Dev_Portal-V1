import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class ApiOverviewService {

  constructor(private http: HttpClient) {

  }
  getEndPointDetails(id: any) {
    // const url = `https://localhost:9443/api/am/devportal/v3/apis/${id}`;
    // const url = `http://localhost:8082/krakend/endpoint/getEndpoint?endpointId=${id}`;


    return this.http.get(urls.getEndpoint + `?endpointId=${id}`);
  }
}
