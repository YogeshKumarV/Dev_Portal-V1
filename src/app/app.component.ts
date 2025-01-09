import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { filter, Subject } from 'rxjs';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Developer-Portal';

  userIdAvailable$ = new Subject<string>();

  constructor(private router:Router, private readonly keycloak:KeycloakService,private mainSer:MainService){}
  ngOnInit(): void {
    // Handle authentication success
    this.keycloak.keycloakEvents$
      .pipe(filter((e: any) => e.type === KeycloakEventType.OnAuthSuccess))
      .subscribe({
        next: () => {
          const token = this.keycloak.getKeycloakInstance().token;
          localStorage.setItem('token', token || '');
 
          this.keycloak
            .getKeycloakInstance()
            .loadUserInfo()
            .then((user: any) => {
              this.getUserDetails(user.sub, () => {
                localStorage.setItem('userid', user.sub);
                this.userIdAvailable$.next(user.sub); // Notify userId availability
                this.router.navigate(['apis']);
              });
            });
        },
      });
 
    // Handle token expiration
    const tokenExpirationChecker = setInterval(() => {
      const keycloakInstance = this.keycloak.getKeycloakInstance();
      if (keycloakInstance.tokenParsed && keycloakInstance.tokenParsed.exp) {
        const currentTime = Math.floor(new Date().getTime() / 1000); // Current time in seconds
        const tokenExpiryTime = keycloakInstance.tokenParsed.exp;
 
        if (tokenExpiryTime <= currentTime) {
          clearInterval(tokenExpirationChecker); // Stop checking
          console.warn('Token has expired. Redirecting to login...');
          this.keycloak.logout(); // Redirect to login
        }
      }
    }, 10000); // Check every 10 seconds
  }
 
  getUserDetails(userId: string, callback: () => void): void {
    // Example API call to fetch user details
    this.keycloak
      .getKeycloakInstance()
      .tokenParsed &&
      this.mainSer.getUserDetails(userId).subscribe({
        next: (res) => {
          console.log(res);
          callback(); // Execute callback after fetching user details
        },
        error: (err) => {
          console.error('Failed to fetch user details:', err);
          this.keycloak.logout();
        },
      });
  }
}
