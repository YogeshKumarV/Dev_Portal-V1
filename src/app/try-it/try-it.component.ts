import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { TryItServiceService } from '../services/try-it-service.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { CommunicationService } from '../services/communication.service';

import { urls } from '../../urls';
import { ApiOverviewService } from '../services/api-overview.service';

import * as bcrypt from 'bcryptjs';





@Component({
  selector: 'app-try-it',
  templateUrl: './try-it.component.html',
  styleUrls: ['./try-it.component.css'] // Note: Corrected the property name from `styleUrl` to `styleUrls`
})
export class TryItComponent implements AfterViewInit {

  isLoading = false;

  receivedData: any;
  
  paramId: any;

  apiDataFromOverview: any;
  userId:any = localStorage.getItem('userid')
  applicationId: any;

  isOAuth2: boolean = false;
  isAuthBasic: boolean = false;
  isApikey: boolean = false;


  isPasswordVisible: boolean = false;
  isTokenVisible: boolean = false;
  isUsernameValid: boolean = false;
  isMatch: boolean = false;
  basicUser:any;
  apiKey:any;
  encodedPassword:any;

  isCopied = false;


  copyInputMessage(inputElement: HTMLInputElement): void {
    const textToCopy = inputElement.value.trim();

    if (!textToCopy) {
      alert('Nothing to copy! Please Generate the Access Token first, to copy.');
      return;
    }

    // Create a temporary textarea element for copying
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);

    // Select the text and copy it
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        // alert('Text copied to clipboard!');
        this.isCopied = true
        setTimeout(()=>{
          this.isCopied = false
        }
        ,5000)
        
      } else {
        alert('Failed to copy text. Please try again.');
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. Please try again.');
    }
    document.body.removeChild(textarea);
    
  }


  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  toggleTokenVisibility(): void {
    this.isTokenVisible = !this.isTokenVisible;
  }

  //  openApiUrl: any;
    
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private tryItServices: TryItServiceService, private communicate : CommunicationService,private overviewService: ApiOverviewService) {
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

validatePassword(): void {
  // Example: if password matches the predefined one
  const correctPassword = 'password123'; // Example password
  if (bcrypt.compareSync(this.password, this.encodedPassword)) {
    this.isMatch = true;
  } else {
    this.isMatch = false;
  }
}
enterUserDeatils(){
  if (!this.username || !this.password) {
    alert('Please enter both username and password.');
    return;
  }
    if (this.isMatch) {
      console.log('Password matches the hash!');
      this.renderSwaggerUIWithBasicAuth(this.username, this.password);
    } else {
      alert('password did not match');
      return;
    }
  // alert(`Username: ${this.username}, Password: ${this.password}`);
  
}
tryItWithApiKey(){
  this.renderSwaggerUIForApiKey(this.apiKey)
}
  getKey(){
    
    this.fetchAccessTokenFromService().subscribe(
      (response: any) => {
        this.accessToken = response.access_token;
        console.log(this.accessToken);
        if (this.accessToken) {
          // alert('ok')
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
  
  ngAfterViewInit(): void {  } 

  private fetchAccessTokenFromService(){
    const headers:any = {
      'consumerId': this.userId,
      'applicationId': this.applicationId
    };
    const options={headers:headers}
    return this.http.post<any>(urls.getToken,null, options);
  }

  private renderSwaggerUI(token: string): void {
    console.log(token);
    
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

  private renderSwaggerUIForApiKey(key: string): void {
    
    
    SwaggerUI({
      dom_id: '#swagger-ui',
      spec: JSON.parse(this.jsonData),
      layout: "BaseLayout",
      requestInterceptor: (req) => {
        req['headers']['Authorization'] = `${key}`;
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
    this.isLoading = true;

    this.tokenFromLocalStorage = localStorage.getItem('token')
    console.log(this.tokenFromLocalStorage)
    this.overviewService.getEndPointDetails(this.paramId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log(res);
        this.apiDataFromOverview = res;
        this.applicationId = this.apiDataFromOverview?.ekeyClockClient?.id;
        console.log(this.applicationId)
        // this.communicate.setApiData(res);
    
        if (this.apiDataFromOverview?.authBasic?.users) {
          this.isAuthBasic = true;
          // Extracting consumer1 and storing in basicUser
          const [basicUser, encodedPassword] = Object.entries(this.apiDataFromOverview.authBasic.users)[0];
    
          // Assigning values
          this.username = basicUser;
          this.encodedPassword = encodedPassword;
    
          console.log('Basic User:', this.basicUser);
          console.log('Encoded Password (BCrypt):', this.encodedPassword);
        }
        if (this.apiDataFromOverview?.authValidator){
          this.isOAuth2 = true;
          console.log(this.isOAuth2);
        }

        if(this.apiDataFromOverview?.authApiKeys){
          this.isApikey = true;
          this.apiKey = this.apiDataFromOverview?.authApiKeys?.keys[0]?.key;
          console.log(this.apiKey);
        }

    
        if (this.apiDataFromOverview) {
          this.tryItServices.getSwaggerSpecFile(this.apiDataFromOverview?.id).subscribe(
            (response) => {
              this.jsonData = JSON.stringify(response);
              console.log('Response:', this.jsonData);
              
            },
            (error) => {
              this.isLoading = false;
              console.error('Error:', error); // Handle errors
            }
          );
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching endpoint details:', error);
      }
    });
    
  
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

  
    
    
    // this.renderSwaggerUI(this.accessToken);

    
    
  }

  
}