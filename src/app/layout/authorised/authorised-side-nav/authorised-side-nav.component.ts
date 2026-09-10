import { Component, OnInit } from '@angular/core';
import { AuthorisedSideNavService } from '../services/authorised-side-nav.service';
import { Router } from '@angular/router';
import { DataService } from '../../../service/data.service';

@Component({
  selector: 'app-authorised-side-nav',
  templateUrl: './authorised-side-nav.component.html',
  styleUrls: ['./authorised-side-nav.component.scss']
})
export class AuthorisedSideNavComponent implements OnInit {

  getId: any;

  constructor(
    public sideNavService: AuthorisedSideNavService,
    public dataService: DataService,
    public router: Router, 
  ) {  }

  ngOnInit(): void {
    console.log("side nav");
  }

  sideMenu_list: any = [
    {
      header: "GYM Management",
      link: "admin/dashboard"    
    },
    {
      header: "Orders",
      link: "admin/orders"    
    },
    {
      header: "Refilling Agent",
      link: "admin/refilling"    
    },
    {
      header: "Technician",
      link: "admin/technician"    
    },
    {
      header: "Products",
      link: "admin/products"    
    },
    {
      header: "Offers",
      link: "admin/offers"    
    },
    {
      header: "Diet Management",
      link: "admin/dietManage"    
    },
    {
      header: "Workout Videos",
      link: "admin/workoutvideos"    
    },
    {
      header: "Feedback",
      link: "admin/feedback"    
    },
    {
      header: "Logout",
      // link: "admin/workoutvideos"    
    },
]

goPage(num, page, flag) {
  console.log("number", num, page, flag);
  if (flag == 'head') {
    if (this.getId == num) {
      this.getId = num + 100;
    } else {
      this.getId = num;
    }
  }
  if (page != undefined) {
    if (page != 'logout') {
      let url = '/' + page + '';
      this.router.navigate([url])
    } else {
      // this.logout();
    }
  }
  this.hideMenu();
}

hideMenu() {
  if (this.dataService.screenWidth <= 910) {
    // this.dataService.showTour = { 'margin-left': '-300px' }
  } else {
    // this.dataService.showTour = { 'margin-left': '0px' }
  }
}

}
