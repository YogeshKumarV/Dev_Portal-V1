import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class TryItServiceService {

  constructor(private http: HttpClient) { }
  getGatewayName(id: any) {
    return this.http.post(urls.getGatewayName + `?endpointId=${id}`, null);
  }

  getSwaggerSpecFile(apiId: any) {
    return this.http.get(urls.openApiSpecFileGetting + `?apiId=${apiId}`)
  }
}
