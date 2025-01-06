import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../services/main.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';
import { CommunicationService } from '../services/communication.service';
import { ToastService } from '../services/toast.service';
import { Subscription } from 'rxjs';
import { ApiProductsService } from '../services/api-products.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent {
  private showSubscriptionApplicationsSubscription!: Subscription; // To track the subscription

  length !: number;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    console.log("CCCCCCCCCCCCCCCCCCCCCCCCc");

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.log("********pageIndex", this.pageIndex);
    console.log("********pageSize", this.pageSize);
    const userId = localStorage.getItem('userid')
    if (userId) {
      this.loadCards()
    }

  }

  apiCards: any[] = []
  // filteredEndpointCards: any[] = []
  // dataSource = new MatTableDataSource<PeriodicElement>([]); // Initially empty
  filteredEndpointCards = new MatTableDataSource<any>([]); // Initially empty
  applicationId: any;
  consumerId: any

  displayedColumns: string[] = ['Api Name', 'version', 'plan', 'status'];
  constructor(private mainSer: MainService, public dialog: MatDialog, private router: Router,
    private route: ActivatedRoute, private communicationsrv: CommunicationService,
    private applicationSer: ApiProductsService, private toastService: ToastService
  ) {

  }


  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // ngAfterViewInit() {
  //   this.filteredEndpointCards.paginator = this.paginator; // Assign paginator after view initialization
  // }

  loadCards() {
    this.mainSer.getEndpointCards(this.pageIndex, this.pageSize).subscribe({
      next: (res: any) => {
        console.log(res);
        this.apiCards = res.apiCards
        this.length = res.totalRecords
        this.filteredEndpointCards.data = this.apiCards.filter(
          (card: any) => card.isSubscribed === true
        );
        console.log("Filtered subscriptions:", this.filteredEndpointCards);
        console.log("subscriptions:", this.apiCards);
      },
      error: (err) => {
        console.error(err);
        // this.showError(err?.error?.message);
        // this.isShowNoApisCard=true
      }
    })
  }

  ngOnInit() {
    const userId = localStorage.getItem('userid')
    this.loadCards()

    // this.showSubscriptionApplicationsSubscription = this.communicationsrv.showSubscriptionApplications$.subscribe(() => {
    //   this.loadCards();
    // });



    this.route?.parent?.paramMap.subscribe(params => {
      this.applicationId = params.get('applicationId');
      // this.consumerId = params.get('consumerId')
      console.log('Application ID:', this.applicationId);
    })

    this.route.parent?.parent?.paramMap.subscribe(params => {
      this.consumerId = params.get('consumerId');
      console.log('Consumer ID:', this.consumerId);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.showSubscriptionApplicationsSubscription) {
      this.showSubscriptionApplicationsSubscription.unsubscribe();
    }
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(SubscriptionDialog, {
  //     data: { appId: this.applicationId, consumerId: this.consumerId },
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     console.log('The dialog was closed');
  //   });
  // }

  showSuccess(message: string) {
    this.toastService.show(message, { type: 'success' });
  }
  showError(message: string) {
    this.toastService.show(message, { type: "error" })
  }

  // unsubscribeApplication(endpointId: any) {
  //   this.applicationSer.unsubscribeApplication(endpointId).subscribe({
  //     next: (res) => {
  //       this.showSuccess(res?.message);
  //       const userId = localStorage.getItem('userid')
  //       if (userId) {
  //         this.loadCards(userId)
  //       }
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       this.showError(err?.message)
  //     }
  //   })
  // }

}
