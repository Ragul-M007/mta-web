import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public router: Router, public dataService: DataService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("authGuard");
    const expectedRole: string[] = route.data.expectedRole;

    
    // decode the token to get its payload
    if (!this.dataService.IS_LOGIN()) { 
      this.router.navigate([`/auth/login`]);
      // return false;
    }
    return true;
  }

}
