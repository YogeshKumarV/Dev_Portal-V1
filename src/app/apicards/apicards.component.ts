import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { filter, Subscription } from 'rxjs';
import { CommunicationService } from '../services/communication.service';
import { ToastService } from '../services/toast.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-apicards',
  templateUrl: './apicards.component.html',
  styleUrl: './apicards.component.css'
})
export class ApicardsComponent implements OnInit , AfterViewInit{

  private subscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private mainSer: MainService, private readonly keycloak: KeycloakService, private communucationSer: CommunicationService,private toastService: ToastService,private appComponent:AppComponent ) {

    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        console.log(this.router.url);

        if (this.router.url === '/apis') {
          this.isShowParent = true;


        } else if (this.router.url === '/apis/create') {
          this.isShowParent = false;
        }
      }
    });
    this.subscription = this.communucationSer.apiCreated$.subscribe(
      (updatedData: any) => {
        console.log('Updated data received from child component!', updatedData);
        this.loadCards();


      }
    );
  }
  ngAfterViewInit(): void {
    this.isShowParent=true
  }

  apiCards: any;
  userDetails: any;
  userId: any = localStorage.getItem('userid');

  showSuccess(message:string) {
    this.toastService.show(message, { type: 'success' });
  }


  showError(message:string){
    this.toastService.show(message , {type:"error"})
  }

  ngOnInit() {
    // this.isShowParent=true
    console.log(this.isShowParent);
    this.appComponent.userIdAvailable$.subscribe((userId) => {
      this.userId = userId;
      this.loadCards(); // Call loadCards only when userId is available
    });
    this.communucationSer.showParent$.subscribe((value) => {
      this.isShowParent = value;
      console.log('showParent updated to:', this.isShowParent);
    });
    this.loadCards();
  }

  loadCards() {
    if (!this.userId) {
    console.error('User ID is not available');
    return;
  }

    this.mainSer.getEndpointCards(0,10).subscribe({
      next: (res: any) => {
        console.log(res);
        this.apiCards = res.apiCards
      },
      error:(err)=>{
        console.error(err);
        this.showError(err?.error?.message);
        this.isShowNoApisCard=true
      }
    })
  }

  isShowParent: boolean = true;
  isShowNoApisCard = false;
  // items=[
  //   {id:1,name:"name1"},
  //   {id:2,name:"name2"},
  //   {id:3,name:"name3"},
  //   {id:4,name:"name4"}
  // ]


  goToCreateApi() {
    // this.isShowParent=false;
    this.communucationSer.updateShowParent(false);
    this.router.navigate(['createapi'], { relativeTo: this.route })
  }
  goToApiViewPage(item: any) {
    // this.isShowParent=false;
    this.communucationSer.updateShowParent(false);
    this.router.navigate([`viewapi/${item.id}/doc`], { state: { body: item }, relativeTo: this.route })
  }

  deleteEndpoint(endpointId:any){
    this.mainSer.deleteEndpoint(endpointId).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.showSuccess(res.message)
        this.loadCards()
      },
      error:(err:any)=>{
        this.showError(err.message)
        this.loadCards()
      }
    })
  }
  goToDeploymentPage(item:any){
    this.isShowParent=false;
    this.router.navigate([`viewapi/${item.id}/deployments`], {state: { body: item },relativeTo: this.route })
  }
}
