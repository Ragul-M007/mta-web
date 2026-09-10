import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';
import { CommonserviceService } from '../../service/commonservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('addUserModal') private addUserModal: ElementRef;
  @ViewChild('fileInput') private fileInput: ElementRef;
  projectDetails: any = {};
  projectList: any = [];
  imageChangedEvent: any;
  files: any = [];
  fileName: any;
  url: any;
  userDetails: any = {};
  adminList: any = [];
  showAdd: boolean;
  showPassword: boolean;
  getUserId: any;
  images: any;
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  stateList: any = [];
  selectedState: any;
  cityList: any = [];
  userRolesList: any = [];
  userData: any = {};
  modelTitle: string;
  value: any;
  gymImage: any;
  showImg: boolean;
  croppedImage: File;
  deleteuser: unknown;
  selecteduser: any;
  addUser: boolean;
  userdetails: any;
  modelBtn: string;
  tempuserDetails: any = {};
  selectedUser: any = {};
  showErr: Boolean = false;
  editImg: boolean = false;
  phoneNumberLength: boolean = false;
  get frm() { return this.addUserForm.controls; }
  get frmedit() { return this.editUserForm.controls; }
  constructor(public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    public formBuilder: FormBuilder,
    private _location: Location,
    private httpClient: HttpClient,
    private common: CommonserviceService) { }

  ngOnInit(): void {
    this.tempuserDetails = this.dataService.getData("userData");
    this.userdetails = this.dataService.getData("userData");
    this.getsubAdmin();
    this.newForm();
    this.addnewForm();
    this.getStates();
    this.getuserRoles();
    //console.log(this.projectDetails);

    var input = document.getElementById('input');
    var invalidChars = ['-', '+', 'e', '.'];

    input.addEventListener('keydown', function (e) {
      if (invalidChars.includes(e.key)) {
        e.preventDefault();
      }
    });
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('date-input').setAttribute('max', today);

  }
  addModal() {
    this.showAdd = true;
    this.modelTitle = "Add Sub Admin ";
    this.modelBtn = "ADD";
    this.showPassword = true;
    // this.images = './../../../assets/image/Camera.png'
    this.addUserForm.reset();


  }
  edit() {

    this.showAdd = false;
    this.modelTitle = "Edit Profile";
    this.modelBtn = "Edit";
    this.userData.area = this.userDetails.area;
    this.userData.city = this.userDetails.city;
    this.userData.email_id = this.userDetails.email_id
    this.userData.mobile_no = this.userDetails.mobile_no;
    this.userData.name = this.userDetails.name;
    this.userData.role = this.userDetails.role
    // this.userData.state= this.userDetails.state;

    for (var i = 0; i < this.stateList.length; i++) {
      if (this.userDetails.state == this.stateList[i].name) {
        this.userData.state = this.stateList[i].code;
        this.getCities(this.stateList[i])
      }
    }
    for (var i = 0; i < this.cityList.length; i++) {
      if (this.userDetails.city == this.cityList[i].name) {
        this.userData.city = this.cityList[i].code;
      }

    }
    this.userData.user_id = this.userDetails.user_id
    // this.userData.user_img= "image/1617016711006_user_img.png"
    this.images = "https://mta.multitechcorp.in/mta-img/" + this.userData.user_img;

    

  };
  getStates() {
    this.stateList = [];
    this.http.getMethod("location/states?country_code=IN").then((response: any) => {
      this.stateList = response.data;
    }).catch((err) => {
      console.log(err);
    });
  }
  getCities(state) {
    if (state.code) {
      this.value = state.code;
      this.selectedState = state.name;
    } else {
      this.value = state.target.value
      this.selectedState = state.target.options[state.target.options.selectedIndex].text;
    }
    this.cityList = [];
    this.addUserForm.controls.city.setValue('')

    this.http.getMethod("location/cities?country_code=IN&state_code=" + this.value).then((response: any) => {
      this.cityList = response.data;
      for (let i = 0; i < this.cityList.length; i++) {
        this.cityList[i].name = this.cityList[i].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      }
    }).catch((err) => {
      console.log(err);
    }); 
  }
  getuserRoles() {
    this.http.getMethod("users/user_roles").then((response: any) => {
      // this.userRolesList.push(...response.data);
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].role_id == 1) {
          this.userRolesList.push(response.data[i]);
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  adduser() {
    // this.images = "./../../../assets/image/user.svg";
    this.addnewForm();
    this.addUser = true;
    // this.addUserForm.patchValue({"userType": 1});
    //this.userData();
  }
  newForm() {
    this.editUserForm = this.formBuilder.group({
      userType: ['', Validators.compose([Validators.required])],
      userName: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([])],
      annDate: ['', Validators.compose([])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      phoneno: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      pass: ['', Validators.compose([Validators.required])],
      cpass: ['', Validators.compose([Validators.required])],
    },

    );
  }
  addnewForm() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var currentdate = dd + '-' + mm + '-' + yyyy;

    this.addUserForm = this.formBuilder.group({
      userType: ['', Validators.compose([Validators.required])],
      userName: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([])],
      annDate: [currentdate, Validators.compose([])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      phoneno: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      pass: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      cpass: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    },
      {
        validators: this.passwordCheck.bind(this)
      }
    );

  }
  passwordCheck(formGroup: FormGroup) {

    const { value: pass } = formGroup.get('pass');
    const { value: cpass } = formGroup.get('cpass');

    if (pass === cpass) {
      this.showErr = false;
    }
    else {
      this.showErr = true;
    }

  }
  editUser(item) {
    this.addUserForm.reset();
    this.addUser = false;
    this.showAdd = false;
    this.showImg = false;
    this.editImg = false;
    this.getUserId = item.user_id
    this.modelTitle = "Edit Profile";
    this.modelBtn = "EDIT";
    // this.userData = {};
    this.selecteduser = item;

    if (item.mobile_no.length == 10) {
      this.phoneNumberLength = false;
    } else {
      this.phoneNumberLength = true;
    }

    var stateCode;

    for (var i = 0; i < this.stateList.length; i++) {
      if (item.state == this.stateList[i].name) {
        stateCode = this.stateList[i].code;
        this.getCities(this.stateList[i]);
      }
    }

    this.addUserForm = this.formBuilder.group({
      userName: [item?.name ? item?.name : item?.user_name, Validators.compose([Validators.required])],
      userType: [item?.role ? item?.role : item?.role_id, Validators.compose([Validators.required])],
      dob: [moment(item?.dob).format('YYYY-MM-DD'), Validators.compose([])],
      email: [item?.email, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      phoneno: [item?.mobile_no, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      state: [stateCode, Validators.compose([Validators.required])],
      city: [item?.city, Validators.compose([Validators.required])],
      area: [item?.area, Validators.compose([Validators.required])],
    })

    // this.userData.userType = item.role ? item.role : item.role_id;
    // this.userData.userName = item.name ? item.name : item.userName;
    // this.userData.email = item.email ? item.email : item.email_id;
    // this.userData.phoneno = item.mobile_no;
    // this.userData.city=item.city;
    // this.userData.state=item.state;
    // this.userData.area = item.area;
    // this.userData.pass = item.password;
    // this.userData.status = item.status;
    // this.userData.dob = moment(item.dob).format('YYYY-MM-DD');
    // this.userData.annDate = moment(item.anniver_date).format('YYYY-MM-DD');
    // this.userData.loginpin = item.loginpin;
    // this.userData.images = item.user_img;
    // this.images = "https://demo.emeetify.com:81/" + item.user_img;

    this.images = this.http.imageURL + item.user_img;


  }

  adduserSubmit() {

    var req = {};

    // if (this.addUserForm.valid) {

    if (this.showAdd) {
      if (this.addUserForm.status == 'VALID' && this.phoneNumberLength == false && this.showErr == false) {
        // var formData: any = new FormData();
        if (this.images?.length > 0 && this.images != undefined || null) {
          req = {
            "role_id": this.addUserForm.value.userType,
            "name": this.addUserForm.value.userName,
            "email": this.addUserForm.value.email,
            "mobile_no": this.addUserForm.value.phoneno,
            "city": this.addUserForm.value.city,
            "state": this.selectedState,
            "area": this.addUserForm.value.area,
            "password": this.addUserForm.value.pass,
            "status": "A",
            "loginpin": "",
            "user_img": this.images

          }
          if (this.addUserForm.value.annDate != "Invalid date" && this.addUserForm.value.dob != "Invalid date") {
            req['anniver_date'] = this.addUserForm.value.annDate;
            req['dob'] = this.addUserForm.value.dob;
          }
        } else {
          req = {
            "role_id": this.addUserForm.value.userType,
            "name": this.addUserForm.value.userName,
            "email": this.addUserForm.value.email,
            "mobile_no": this.addUserForm.value.phoneno,
            "city": this.addUserForm.value.city,
            "state": this.selectedState,
            "area": this.addUserForm.value.area,
            "password": this.addUserForm.value.pass,
            "status": "A",
            "loginpin": "",
            "user_img": this.images
            // "user_img": this.common.projectImg

          }
          if (this.addUserForm.value.annDate != "Invalid date" && this.addUserForm.value.dob != "Invalid date") {
            req['anniver_date'] = this.addUserForm.value.annDate;
            req['dob'] = this.addUserForm.value.dob;
          }
        }

        this.http.postMethod("users", req).then((response: any) => {
          
          this.dataService.showSuccess("success", response.message);
          this.images = [];
          this.getsubAdmin();
          this.addUserModal.nativeElement.click();
          this.closeModal.nativeElement.click();
          this.addUserForm.reset();
        }).catch((err) => {
          console.log(err);
        });


      }
      else {
        // if (!this.images) {
        //   this.dataService.showError("error", "Please select the profile image");
        // }

        this.dataService.markFormGroupTouched(this.addUserForm);
        // if(!this.phoneNumberLength){
        //   this.phoneNumberLength = false;
        // }
      }
    } else {

      if (this.addUserForm.status == 'VALID' && this.phoneNumberLength == false && this.showErr == false) {
        if (!this.showImg) {
          req = {
            "role_id": this.addUserForm.value.userType,
            "name": this.addUserForm.value.userName,
            "email": this.addUserForm.value.email,
            "mobile_no": this.addUserForm.value.phoneno,
            "city": this.addUserForm.value.city,
            "state": this.selectedState,
            "area": this.addUserForm.value.area,
            // "password": this.addUserForm.value.pass,
            "status": "A",
            "user_img": 'data:image/png;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PHBhdGggZD0ibTI1NiAwLTE2MC4zOTggMjU2IDE2MC4zOTggMjU2YzE0MS4zODUgMCAyNTYtMTE0LjYxNSAyNTYtMjU2cy0xMTQuNjE1LTI1Ni0yNTYtMjU2eiIgZmlsbD0iIzI4YWJmYSIvPjxwYXRoIGQ9Im0wIDI1NmMwIDE0MS4zODUgMTE0LjYxNSAyNTYgMjU2IDI1NnYtNTEyYy0xNDEuMzg1IDAtMjU2IDExNC42MTUtMjU2IDI1NnoiIGZpbGw9IiMxNGNmZmYiLz48cGF0aCBkPSJtMjU2IDYwLTY1Ljc4OCAxMDUgNjUuNzg4IDEwNWM1Ny45OSAwIDEwNS00Ny4wMSAxMDUtMTA1cy00Ny4wMS0xMDUtMTA1LTEwNXoiIGZpbGw9IiMzNzNlOWYiLz48cGF0aCBkPSJtMTUxIDE2NWMwIDU3Ljk5IDQ3LjAxIDEwNSAxMDUgMTA1di0yMTBjLTU3Ljk5IDAtMTA1IDQ3LjAxLTEwNSAxMDV6IiBmaWxsPSIjNjI0MWVhIi8+PHBhdGggZD0ibTQyNC42NDkgMzM1LjQ0M2MtMTkuOTMzLTIyLjUyNS00OC42LTM1LjQ0My03OC42NDktMzUuNDQzaC05MGwtNjAgNzYgNjAgNzZjNzAuMzIyIDAgMTM1LjYzNi0zOC4wMSAxNzAuNDU0LTk5LjE5OGw1LjMwNi05LjMyNXoiIGZpbGw9IiMzNzNlOWYiLz48cGF0aCBkPSJtMTY2IDMwMGMtMzAuMDQ5IDAtNTguNzE2IDEyLjkxOC03OC42NDkgMzUuNDQzbC03LjExIDguMDM1IDUuMzA2IDkuMzI1YzM0LjgxNyA2MS4xODcgMTAwLjEzMSA5OS4xOTcgMTcwLjQ1MyA5OS4xOTd2LTE1MnoiIGZpbGw9IiM2MjQxZWEiLz48L2c+PC9zdmc+'

          }
          if (this.addUserForm.value.annDate != "Invalid date" && this.addUserForm.value.dob != "Invalid date") {
            req['anniver_date'] = this.addUserForm.value.annDate;
            req['dob'] = this.addUserForm.value.dob;
          }
        } else {
          req = {
            "role_id": this.addUserForm.value.userType,
            "name": this.addUserForm.value.userName,
            "email": this.addUserForm.value.email,
            "mobile_no": this.addUserForm.value.phoneno,
            "city": this.addUserForm.value.city,
            "state": this.selectedState,
            "area": this.addUserForm.value.area,
            // "password": this.addUserForm.value.pass,
            "status": "A",
            "user_img": this.images

          }
          if (this.addUserForm.value.annDate != "Invalid date" && this.addUserForm.value.dob != "Invalid date") {
            req['anniver_date'] = this.addUserForm.value.annDate;
            req['dob'] = this.addUserForm.value.dob;
          }
        }

        this.http.putMethod("users/" + this.getUserId, req).then((response: any) => {
          this.dataService.showSuccess("success", response.message);

          this.getsubAdmin();
          this.addUserModal.nativeElement.click();
          this.images = [];
        }).catch((err) => {
          console.log(err);
        });
      } else {
        this.dataService.markFormGroupTouched(this.addUserForm)
      }

    }
    // }
    // else {
    //   this.dataService.markFormGroupTouched(this.addUserForm)
    // }


    // } else {
    //   if (!this.images) {
    //     this.dataService.showError("error", "Please select the profile image");
    //   }

    //   this.dataService.markFormGroupTouched(this.addUserForm);
    // }

  }
  getsubAdmin() {
    this.adminList = [];
    this.http.getMethod("users").then((response: any) => {

      let res = response.data;
      for (var i = 0; i < res.length; i++) {
        if (res[i].role_id == 1 && res[i].user_id != 4) {
          this.adminList.push(res[i]);
        }
        if (this.tempuserDetails.user_id === res[i].user_id) {
          this.userDetails = res[i];
        }
      }

    }).catch((err) => {
      console.log(err);
    });
  }

  viewProjects(item) {
    this.router.navigate(["admin/viewproject"], { queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });
  }
  selectImage(event: any) {

    this.gymImage = event.files[0];
    if (event.files[0]) {
      this.dataService.readImage(event.files[0]).then((base64Data: any) => {
        this.images = base64Data.result;
      });
    }
  }

  fileChangeEvent(event: any): void {

    // this.showImg = true;
    // this.imageChangedEvent = event;
  
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/gif', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        // Invalid file type
        this.fileInput.nativeElement.value = '';
        this.images = ''
        this.showImg = false;
        this.dataService.showError("Error", "Only Image Formats Accept!");
        // this.form.get('image').setErrors({ invalidFileType: true });
      } else {
        // Valid file type
        // this.form.get('image').setErrors(null);

        this.showImg = true;
        this.editImg = true;
        this.imageChangedEvent = event;

      }
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.images = event.base64;

    // this.croppedImage = this.base64ToFile(
    //   event.base64,
    //   this.imageChangedEvent.target.files[0].name,
    // )
    this.croppedImage = this.imageChangedEvent.target.files[0];

    return this.croppedImage;
  }

  imageLoaded() {
    /* show cropper */
  }

  cropperReady() {
    /* cropper ready */
  }

  loadImageFailed() {
    /* show message */
  }

  base64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  saveImage() {
    this.showImg = false;
  }
  backClicked() {
    this._location.back();
  }

  viewUser(item) {
    item.from = 'admin';
    state: { data: item }
    this.router.navigate(["admin/userdetails"], { queryParams: { data: JSON.stringify(item) }, skipLocationChange: true });
    // this.router.navigate(["admin/userdetails"], { state: { data: item }});

  }


  async deleteUser(item) {
    this.deleteuser = await this.dataService.showDelete("Please Confirm", "The selected User will be Deleted?", "Delete");


    if (this.deleteuser == true) {
      this.http.deleteMethod('users/' + item.user_id, '').then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.getsubAdmin();
        this.closeModal.nativeElement.click();
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  viewpic(item) {
    this.selectedUser = item;
  }

  backFun() {
    this.fileInput.nativeElement.value = '';
    this.images = [];
    this.showImg = false;
    this.addUserForm.reset();
    this.getStates();
    this.showAdd = false;
    this.editImg = false; 
    this.phoneNumberLength = false;
  }
  lengthCheck(event) {

    if (event.target.value.length == 10) {
      this.phoneNumberLength = false;
    } else {
      this.phoneNumberLength = true;
    }

  }
  preventFuturedate(e) {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      // Prevent the input or handle the error
      e.target.value = '';
    }
  }
  onTabPress(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
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

  removeImg() {
    if (this.editImg == true) {
      this.editImg = false;
      this.images = '';

    }

    this.showImg = false;
    this.images = [];
  }
}
