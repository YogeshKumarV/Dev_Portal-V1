import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { TryItServiceService } from '../services/try-it-service.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterState, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-try-it',
  templateUrl: './try-it.component.html',
  styleUrls: ['./try-it.component.css'] // Note: Corrected the property name from `styleUrl` to `styleUrls`
})
export class TryItComponent implements AfterViewInit {



  receivedData: any;
  apiData: any;
  paramId: any;



  private tokenUrl = 'http://10.175.1.112:8080/realms/master/protocol/openid-connect/token';
  // private openApiUrl: any; // Path to your OpenAPI specification

  //  openApiUrl = '../assets/demo.json';

  openApiUrl: any;

  // private openApiUrl = 'http://localhost:3000/swagger';
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private tryItServices: TryItServiceService) {
    console.log(history);
    const state: RouterState = router.routerState;
    console.log(state);
    const snapshot: RouterStateSnapshot = state.snapshot;
    // console.log(snapshot)
    const root: ActivatedRouteSnapshot = snapshot.root;
    // console.log(root);

    const child = root.firstChild;

    // console.log(child)

    // console.log(root.children.slice()[0].children.slice()[0].paramMap.get('id'));


    this.paramId = root.children.slice()[0].children.slice()[0].paramMap.get('id');


    this.receivedData = history.state

    // console.log(this.receivedData);
  }

  ngAfterViewInit(): void {
    this.fetchAccessToken().subscribe(
      (response: any) => {
        const accessToken = response.access_token;
        if (accessToken) {
          this.renderSwaggerUI(accessToken);
        } else {
          console.error('Access token not found in the response.');
        }
      },
      error => {
        console.error('Failed to fetch access token:', error);
        // You can display an error message or handle the failure case here.
      }
    );
  }

  private fetchAccessToken() {
    const body = new URLSearchParams();
    body.set('client_id', 'publisherportal');
    body.set('client_secret', 'EEctYAskWkXarPFIGt2VPEA7GBQHcZX9');
    body.set('username', 'admin');
    body.set('password', 'admin');
    body.set('grant_type', 'password');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(this.tokenUrl, body.toString(), { headers });
  }

  private renderSwaggerUI(token: string): void {
    SwaggerUI({
      dom_id: '#swagger-ui',
      url: this.openApiUrl,
      layout: "BaseLayout",
      requestInterceptor: (req) => {
        console.log(token);

        req['headers']['Authorization'] = `Bearer ${token}`;
        return req;
      }
    });
  }

  ngOnInit(): void {
    this.tryItServices.getGatewayName(this.paramId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.apiData = res.message;
        console.log(this.apiData);




      }
    })
    // Retrieve the 'id' from the parent route
    this.route.parent?.paramMap.subscribe(params => {
      this.paramId = params.get('id');
      // console.log('Parent ID:', this.paramId); // Should log the ID (e.g., '854')
    });
    // this.openApiUrl = this.tryItServices.getSwaggerSpecFile(this.apiData)
    // console.log(this.openApiUrl);

    this.tryItServices.getSwaggerSpecFile(this.apiData).subscribe({
      next: (res) => {
        console.log(res);

      }
    })



  }
}