import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiProductsService } from '../services/api-products.service';


@Component({
  selector: 'app-api-product-overview',
  templateUrl: './api-product-overview.component.html',
  styleUrl: './api-product-overview.component.css'
})
export class ApiProductOverviewComponent {
  applicationId: any
  data: any
  applicationData: any
  isTokenVisible: boolean = false;
  isCopied = false;


  constructor(private router: Router, private route: ActivatedRoute,private applicationsrv:ApiProductsService) {
    // console.log("bbbbbbbbbbbbbbbbb",this.router?.getCurrentNavigation()?.extras.state);
    // const stateObj = this.router.lastSuccessfulNavigation?.extras.state;
    // console.log("ccccccccccccccccc", stateObj);
    // const navigation = this.router.getCurrentNavigation();
    // this.data = navigation?.extras.state?.['data'];
    // console.log("11111111111111111111", this.data);
    // this.applicationData = history.state;
    // console.log("*********************", this.applicationData)
  }

  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  toggleTokenVisibility(): void {
    this.isTokenVisible = !this.isTokenVisible;
  }
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

  ngOnInit() {

     this.applicationsrv.getApiproductData$().subscribe({
      next:(data)=>{
        this.applicationData=data
      },
      error:(err)=>{
        console.log("error",err);
        
      }
     })

    // const navigation = this.router.getCurrentNavigation();
    // if (navigation) {
    //   console.log('Navigation:', this.router.getCurrentNavigation());
    //   this.data = navigation?.extras.state?.['data'];
    // }
    // const navigation = this.router.getCurrentNavigation();
    // this.data = navigation?.extras.state?.['data'];
    // console.log("22222222222222222222", this.data);

    this.route?.parent?.paramMap.subscribe(params => {
      this.applicationId = params.get('applicationId');
      console.log('Application ID:', this.applicationId);
    });
  }
}
