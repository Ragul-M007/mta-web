import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})

export class HttpErrorInterceptor implements HttpInterceptor {
    userData$ = new BehaviorSubject<any>('');
    constructor(
        private router: Router,
        public dataService: DataService
        ) {
    }
    // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     await this.showLoader();
    //     return next.handle(req).pipe(tap( async(event: HttpEvent<any>) => {
    //         if (event instanceof HttpResponse) {    
    //             await this.hideLoader();
    //         }
    //     },
    //          async(err: any) => {
    //             console.log(err.status);
    //             await this.hideLoader();
    //         }));
    // }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap(async (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
        },
            async (err: any) => {

                if (err.status == 404) {
                    this.dataService.showError('Error', err.error.message);
                }
            }))
        }
}