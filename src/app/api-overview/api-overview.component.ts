import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { ApiOverviewService } from '../services/api-overview.service';

@Component({
  selector: 'app-api-overview',
  templateUrl: './api-overview.component.html',
  styleUrl: './api-overview.component.css'
})
export class ApiOverviewComponent {


  receivedData: any;
  apiData: any;
  paramId: any;


  constructor(private router: Router, private route: ActivatedRoute, private overviewService: ApiOverviewService) {
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

  // ngOnInit(){
  //   this.route.paramMap.subscribe((params) => {
  //     this.paramId = params.get('id');
  //     console.log(this.paramId);

  //   });

  // }
  ngOnInit(): void {
    this.overviewService.getEndPointDetails(this.paramId).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.apiData = res;
        console.log(this.apiData);



      }
    })
    // Retrieve the 'id' from the parent route
    this.route.parent?.paramMap.subscribe(params => {
      this.paramId = params.get('id');
      // console.log('Parent ID:', this.paramId); // Should log the ID (e.g., '854')
    });
  }

}
