import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem("token");
    console.log("Auth Token:", authToken);
 
    // Clone the request to add the Authorization header
    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      });
    }
 
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn("Token expired or unauthorized. Redirecting to login...");
          this.keycloak.logout();
        }
        return throwError(error);
      })
    );
  }
}