import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiOverviewService } from '../services/api-overview.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent implements AfterViewInit {
  
 
  constructor(private http: HttpClient,private apiOverViesService:ApiOverviewService,private route:ActivatedRoute) {}
 apiId:any;
  ngAfterViewInit() {
    // Load Redoc script dynamically
    this.route.parent?.paramMap.subscribe(params => {
      this.apiId = params.get('id');
      if(this.apiId){
        this.getDoc(this.apiId)
      }
      
    });
  }
getDoc(apiId:any){
  const redocScript = document.createElement('script');
    redocScript.src = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
    redocScript.onload = () => {
      // Fetch OpenAPI spec from backend
      this.apiOverViesService.getSwagger(apiId).subscribe({
        next: (spec) => {
          // Initialize Redoc with the fetched spec
          (window as any).Redoc.init(spec, {
            scrollYOffset: 50,
            theme: {
              colors: { primary: { main: '#0056b3' } },
              typography: { fontSize: '16px', fontFamily: 'Arial, sans-serif' },
            },
          }, document.getElementById('redoc-container'));
        },
        error: (err) => {
          console.error('Error fetching OpenAPI spec:', err);
        }
      });
    };
    document.body.appendChild(redocScript);
}
  

}
