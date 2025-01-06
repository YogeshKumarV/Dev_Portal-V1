import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor() { }
  private apiCreatedSource = new Subject<any>();

  apiCreated$ = this.apiCreatedSource.asObservable();

  emitApiCreated(data: any) {
    this.apiCreatedSource.next(data);
  }
  private gatewayCreatedSource = new Subject<any>();

  gatewayCreated$ = this.gatewayCreatedSource.asObservable();

  emitGatewayCreated(data: any) {
    this.gatewayCreatedSource.next(data);
  }

  // showparent
  private showParentSource = new BehaviorSubject<boolean>(true); // Initial state is true
  showParent$ = this.showParentSource.asObservable();

  updateShowParent(value: boolean) {
    this.showParentSource.next(value);
  }
  private apiData: ReplaySubject<string> = new ReplaySubject<string>(1);
 
  setApiData(data: string): void {
    this.apiData.next(data);
  }
 
  getApiData$(): Observable<string> {
    return this.apiData.asObservable();
  }

  private applicationCreatedSource = new Subject<any>
  applicationCreated$ = this.applicationCreatedSource.asObservable()
  emitApplicationCreated(data: any) {
    this.applicationCreatedSource.next(data)
  }
}
