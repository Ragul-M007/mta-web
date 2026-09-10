import { Component, ElementRef, OnInit, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { HttpService } from '../service/http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
  
})
export class SuperAdminComponent implements OnInit {
  userdetails: any;
  usersCounts: any = 0;
  attendanceCount: any;
  changePasswordForm: FormGroup;

  get passwdFrm() {
    return this.changePasswordForm.controls;
  }

  showErr = false;
  userActivity;
  userInactive: Subject<any> = new Subject();
  constructor(
    private el: ElementRef,
    public router: Router,
    public dataService: DataService,
    public http: HttpService,
    public formBuilder: FormBuilder
  ) {
    // this.setTimeout();
    this.userInactive.subscribe(() => {
      this.logout();
    });
  }

  ngOnInit(): void {
    this.usersList();
    this.attendanceListCheck();
    
    this.userdetails = this.dataService.getData('userData');


    this.changePasswordForm = this.formBuilder.group(
      {
        oldPass: ['', Validators.compose([Validators.required])],
        pass: ['', Validators.compose([Validators.required])],
        cpass: ['', Validators.compose([Validators.required])],
      },
      {
        validators: this.passwordValidate.bind(this),
      }
    );
    // $("#sidebarCollapse").click(function(e) {
    //   e.preventDefault();
    //   $("#wrapper").toggleClass("toggled");
    // });

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     // Call your function when a navigation to this component occurs.
    //     this.updateAttendance();
    //   }
    // });

    this.dataService.resetActivityTime();

  }

  updateAttendance() {
    this.attendanceCount = 0;
    // this.http
    //   .getMethod('attendance/updateattendancecounts')
    //   .then((response: any) => {
    //     // this.attendanceListCheck();
    //   });
  }

  addGymSubmit() { }

  passwordValidate(formGroup: FormGroup) {
    const { value: password } = formGroup.get('pass');
    const { value: confirmPassword } = formGroup.get('cpass');
    if (password === confirmPassword) {
      this.showErr = false;
    } else {
      this.showErr = true;
    }
  }

  openMenu() {
    let myTag = this.el.nativeElement.querySelector('#sidebar');
    let toggtag = this.el.nativeElement.querySelector('#content-togg');

    if (!toggtag.classList.contains('active')) {
      toggtag.classList.add('active');
    } else {
      toggtag.classList.remove('active');
    }

    if (!myTag.classList.contains('active')) {
      myTag.classList.add('active');

    } else {
      myTag.classList.remove('active');
      // this.dataService.showTour = { 'margin-left': '15.5em !important' };
      // console.log('inactive');
    }
  }

  // closeMenu(){
  //   // this.sideClass = 'not-open';
  //   this.showToggle = !this.showToggle;
  //   let myTag = this.el.nativeElement.querySelector("#sidebar");
  //   if (!myTag.classList.contains('active')) {
  //     // myTag.classList.remove('inactive');
  //     myTag.classList.add('active');
  //     console.log("active");
  //   }
  // }

  // fetchAllAttendance(item){

  //   this.http.getMethod("attendance/?date=").then((response: any) => {

  //     let res = response.data;
  //   this.docUrl=res.docUrl;
  //     console.log(res);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

  usersList() {
    this.http
      .getMethod('users/usercounts')
      .then((response: any) => {
        let res = response.data;
              
        this.usersCounts = res.length;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateUsersList() {
    this.usersCounts = '';
    this.closeSubmenu();
    // this.http
    //   .getMethod('users/updateusercounts')
    //   .then((response: any) => {
    //     this.usersList();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  attendanceListCheck() {
    this.attendanceCount = '';
    this.http.getMethod('attendance/attendancecounts').then((response: any) => {
      this.attendanceCount = response.data?.length;
    });
  }

  logout() {
    this.dataService.showSuccess("success", "logout successfully!")
    setTimeout(() => {
      this.dataService.removeData('token');
      this.router.navigate([`/auth/login`]);
    }, 1500);

  }

  GotoProfile() {
    this.router.navigate([`/admin/profile`]);
  }
  closeSubmenu() {
    var submenu = document.getElementById("submenu");

    if (submenu.classList.contains("show")) {
      submenu.classList.remove("show");
      document.querySelector('li a[routerLink="attendanceView"]').classList.add("closed-submenu-background");
    }
    if (submenu.classList.contains("active2")) {
      submenu.classList.remove("active2");
    }
  }

  checkSessionTimeoutPeriodically(): void {
    setInterval(() => {
      if (this.dataService.checkSessionTimeout()) {
        this.logout();
      }
    }, 2 * 60 * 1000); // Check every minute (adjust as needed)
  }

  //   setTimeout() {
  //     console.log("asdasdasd", localStorage.getItem('token'));
  // let token=localStorage.getItem('token')
  //     if(token){
  //       console.log("9999999999999999");

  // this.userActivity = setTimeout(() =>
  //       this.userInactive.next(undefined), 43200000); // 3 minutes
  //     }
  //   }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:mousedown') refreshUserState() {
    // console.log("mouse event");
    clearTimeout(this.userActivity);
    // this.setTimeout();
    let token = localStorage.getItem('token')
    if (token) {
      this.userActivity = setTimeout(() =>
        this.userInactive.next(undefined), 43200000); // 3 minutes
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the Tab key is pressed
    if (event.key === 'Tab') {
      // Prevent the default tab behavior
      event.preventDefault();
    }
  }

}
