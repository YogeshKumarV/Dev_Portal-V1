import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewapi',
  templateUrl: './viewapi.component.html',
  styleUrl: './viewapi.component.css'
})
export class ViewapiComponent implements OnInit {

  endpointInfo:any;

  securityDetails:any;

  ngOnInit(): void {
   const obj = history.state;
   console.log(obj?.body);
   this.endpointInfo = obj?.body;
   if(this.endpointInfo?.isSubscribedToApp){
    this.securityDetails = "OAuth";
   }else if(this.endpointInfo?.isSubscribedToBasic){
    this.securityDetails = "Basic Auth";
   }else if(this.endpointInfo?.isSubscribedToKeys){
    this.securityDetails = "Api Key";
   }else{
    this.securityDetails = "No Auth";
   }
   
  }



  
}
