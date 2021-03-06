import { Injectable } from '@angular/core';
import { authService } from './auth-service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty, Subject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';


@Injectable({providedIn: 'root'})

export class WebReqInterceptor implements HttpInterceptor {
    constructor(private authService: authService) { }

    refreshingAccessToken: boolean;
  
    accessTokenRefreshed: Subject<any> = new Subject();
  
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
      // Handle the request
      request = this.addAuthHeader(request);
  
      // call next() and handle the response
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
  
          if (error.status === 401) {
            // 401 error so we are unauthorized
  
            // refresh the access token
            return this.refreshAccessToken()
              .pipe(
                switchMap(() => {
                  request = this.addAuthHeader(request);
                  return next.handle(request);
                }),
                catchError((err: any) => {
                  console.log(err);
                  this.authService.logout();
                  return empty();
                })
              )
          }
  
          return throwError(error);
        })
      )
    }
  
    refreshAccessToken() {
      if (this.refreshingAccessToken) {
        return new Observable(observer => {
          this.accessTokenRefreshed.subscribe(() => {
            observer.next();
            observer.complete();
          })
        })
      } else {
        this.refreshingAccessToken = true;
        return this.authService.getNewAccessToken().pipe(
          tap(() => {
            console.log("Access Token Refreshed!");
            this.refreshingAccessToken = false;
            this.accessTokenRefreshed.next();
          })
        )
      }
      
    }
  
  
    addAuthHeader(request: HttpRequest<any>) {
     
      const token = this.authService.getAccessToken();
  
      if (token) {
            return request.clone({
          setHeaders: {
            'x-access-token': token
          }
        })
      }
      return request;
    }
  
    
}