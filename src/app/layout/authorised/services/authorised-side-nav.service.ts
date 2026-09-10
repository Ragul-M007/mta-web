import { Injectable, NgZone } from '@angular/core';
import { DataService } from '../../../service/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorisedSideNavService {
  hideSideNav: boolean = false;

  constructor(
    public dataService: DataService,
    public ngzone: NgZone
  ) { 
  }

  toggleSideNav(): void {
    // console.log("toggle", this.commonservice.showTour)
    this.hideSideNav = !this.hideSideNav;
    this.ngzone.run(() => {
      if (!this.hideSideNav) {
        // this.dataService.showTour = { 'margin-left': '0px' }
      } else {
        // this.dataService.showTour = { 'margin-left': '-300px' }
      }
    })
  }

}
