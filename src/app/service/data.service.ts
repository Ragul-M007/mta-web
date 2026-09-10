import { Injectable, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2'
import { LocalStorageService } from 'angular-web-storage';
import  moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  // static ROLES: USER_ROLES = {
  //   SUPERADMIN: "SUPERADMIN"
  // };
  userProfile: any = {};
  authToken: any = "";
  selectedGym: any;
  _showTour: any;
  screenWidth: number = window.screen.width;
  diet_flag: any;
  
  private lastActivityTime: number;
  private readonly sessionTimeout = 10 * 60 * 60 * 1000;

  constructor(public Spinner: NgxSpinnerService, public ngZone: NgZone, private route: ActivatedRoute,
    private router: Router, private local: LocalStorageService, ) {
      this.resetActivityTime();

      // window.onresize = (e) => {
      //   ngZone.run(() => {
      //     this.screenWidth = window.screen.width;
  
      //     if (this.screenWidth <= 910) {
      //       this.showTour = { 'margin-left': '-300px' }
      //     } else {
      //       this.showTour = { 'margin-left': '0px' }
      //     }
      //   });
      // };

  }


  IS_LOGIN() { //Auth Guard Service
    if (this.local.get('token')) {
      return true;
    } else {
      return false;
    }

  }

  dismissLoading() {
    this.Spinner.hide();
  }
  presentLoading() {
    this.Spinner.show();
  }

  showError(title: any, message: any) {
    Swal.fire({
      title: title,
      position: 'center',
      icon: 'error',
      text: message,
      timerProgressBar: true,
      showConfirmButton: false,
      timer: 3500,
      width: '25rem',
    })
  }
  showSuccess(title, message) {
    Swal.fire({
      title: title,
      position: 'center',
      icon: 'success',
      text: message,
      timerProgressBar: true,
      showConfirmButton: false,
      timer: 2000,
      width: '25rem'
    })
  }
  console(data: any) {
    // console.log(data);
  }

  navigateForward(pageName: string, isRoot = false) {
    this.ngZone.run(() => {
      // this.navCtrl.navigateForward('/' + pageName);
      this.router.navigate([pageName], { relativeTo: this.route, queryParams: { page: 1 } });
      // if (isRoot) {
      //   this.navCtrl.setDirection('root');
      // }
    });
  }

  readImage(files: any) {
    return new Promise(async (resolve, reject) => {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        resolve(e.currentTarget);
      };
      reader.readAsDataURL(files);
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  showDelete(title = "", text = "", confirmBtn = "") {
    return new Promise(async (resolve, reject) => {
      Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmBtn
      }).then((result) => {
        this.console(result);
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  }

  

  categoryModal(title = "", ok = " ", cancel = false, placeholder = "", error = "") {
    return new Promise(async (resolve, reject) => {
      Swal.fire({
        title: title,
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        inputPlaceholder: placeholder,
        showCancelButton: cancel,

        confirmButtonText: ok,
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          this.console(login)
          error = error
          if (!login) {
            Swal.showValidationMessage(
              `${error}`
            )
          } else {
            resolve(login);
          }
          // return login;
          // return fetch(`//api.github.com/users/${login}`)
          //   .then(response => {
          //     if (!response.ok) {
          //       throw new Error(response.statusText)
          //     }
          //     return response.json()
          //   })
          //   .catch(error => {
          //     Swal.showValidationMessage(
          //       `Request failed: ${error}`
          //     )
          //   })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (!result.isConfirmed) {
          this.console("cancel");
        }
      })
    });
  }

  sortData(data) {
    return data.sort((a, b) => {
      // console.log("a.date", a.date);
      return <any>new Date(b.date) - <any>new Date(a.date);
    });
  }

  dateFormat(date) {
    return moment(date).format('DD-MM-YYYY');
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  setData(key, data) {
    this.local.set(key, data);
  }

  removeData(key) {
    this.local.remove(key);
  }

  getData(key) {
    return this.local.get(key);
  }

  clearData() {
    this.local.clear();
  }

  resetActivityTime(): void {
    this.lastActivityTime = Date.now();
  }

  updateActivityTime(): void {
    this.lastActivityTime = Date.now();
  }

  checkSessionTimeout(): boolean {
    const elapsedTime = Date.now() - this.lastActivityTime;
    return elapsedTime > this.sessionTimeout;
  }
}
