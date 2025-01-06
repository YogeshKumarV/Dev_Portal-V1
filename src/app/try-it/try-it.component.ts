import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { TryItServiceService } from '../services/try-it-service.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { CommunicationService } from '../services/communication.service';

import { urls } from '../../urls';

@Component({
  selector: 'app-try-it',
  templateUrl: './try-it.component.html',
  styleUrls: ['./try-it.component.css'] // Note: Corrected the property name from `styleUrl` to `styleUrls`
})
export class TryItComponent implements AfterViewInit {

  

  receivedData: any;
  
  paramId: any;

  apiDataFromOverview: any;
  userId:any = localStorage.getItem('userid')
  applicationId: any;

  isPasswordVisible: boolean = false;
  isTokenVisible: boolean = false;

  copyToClipboard(): void {
    
    // Use the Clipboard API to copy the token
    if (this.accessToken) {
      navigator.clipboard.writeText(this.accessToken).then(() => {
        alert('Access Token copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy the token: ', err);
      });
    } else {
      alert('No Access Token to copy.');
    }
  }


  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  toggleTokenVisibility(): void {
    this.isTokenVisible = !this.isTokenVisible;
  }

  //  openApiUrl: any;
    
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private tryItServices: TryItServiceService, private communicate : CommunicationService) {
    console.log(history);
    const state: RouterState = router.routerState;
    console.log(state);
    const snapshot: RouterStateSnapshot = state.snapshot;
    // console.log(snapshot)
    const root: ActivatedRouteSnapshot = snapshot.root;
    const child = root.firstChild;
    this.paramId = root.children.slice()[0].children.slice()[0].paramMap.get('id');
    this.receivedData = history.state
  }

  accessToken: any;
  username: string = ''; // Store username for basic authentication
password: string = ''; // Store password for basic authentication
enterUserDeatils(){
  if (!this.username || !this.password) {
    alert('Please enter both username and password.');
    return;
  }
  alert(`Username: ${this.username}, Password: ${this.password}`);
  this.renderSwaggerUIWithBasicAuth(this.username, this.password);
}
  getKey(){
    
    this.fetchAccessTokenFromService().subscribe(
      (response: any) => {
        this.accessToken = response.access_token;
        console.log(this.accessToken);
        
        if (this.accessToken) {
         
           this.renderSwaggerUI(this.accessToken);
        } else {
          console.error('Access token not found in the response.');
        }
      },
      error => {
        console.error('Failed to fetch access token:', error);
        }
    );
  }
  
  ngAfterViewInit(): void {
    
  }

  private fetchAccessTokenFromService(){
    const headers:any = {
      'consumerId': this.userId,
      'applicationId': this.applicationId
    };
    const options={headers:headers}
    return this.http.post<any>(urls.getToken,null, options);
  }

  private renderSwaggerUI(token: string): void {
    SwaggerUI({
      dom_id: '#swagger-ui',
      spec: JSON.parse(this.jsonData),
      layout: "BaseLayout",
      requestInterceptor: (req) => {
        console.log(token);

        req['headers']['Authorization'] = `Bearer ${token}`;
        return req;
      }
    });
  }

  jsonData:any;
  private renderSwaggerUIWithBasicAuth(username: string, password: string): void {
    
    
    SwaggerUI({
      dom_id: '#swagger-ui',
      spec: JSON.parse(this.jsonData),
      layout: "BaseLayout",
      requestInterceptor: (req) => {
        const credentials = btoa(`${username}:${password}`);
        console.log(credentials)
        req['headers']['Authorization'] = `Basic ${credentials}`;
        console.log('Authorization Header:', req['headers']['Authorization']);
        return req;
      }
    });
  }
  

  tokenFromLocalStorage: any;

  ngOnInit(): void {

    this.tokenFromLocalStorage = localStorage.getItem('token')
    console.log(this.tokenFromLocalStorage)
    
  
    this.communicate.getApiData$().subscribe((data:any)=>{
      console.log(data);
      this.apiDataFromOverview=data;
      this.applicationId = data?.ekeyClockClient?.id;
      console.log(this.applicationId);
      
    })


    // Retrieve the 'id' from the parent route
    this.route.parent?.paramMap.subscribe(params => {
      this.paramId = params.get('id');
      
    });
    
    //  this.openApiUrl = urls.openApiSpecFileGetting+`?apiId=${this.apiDataFromOverview?.id}`;

    this.tryItServices.getSwaggerSpecFile(this.apiDataFromOverview?.id).subscribe(
      (response) => {
        this.jsonData = JSON.stringify(response);
        console.log('Response:', this.jsonData);
      },
      (error) => {
        console.error('Error:', error); // Handle errors
      }
    )
    
    
    // this.renderSwaggerUI(this.accessToken);
    
  }

  
}