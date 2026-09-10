import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  buttonClicked: EventEmitter<any> = new EventEmitter<any>()
  
  loginForm: FormGroup;
  otp: any;
  get frm() { return this.loginForm.controls; }

  emailForm: FormGroup;
  get emailFrm() { return this.emailForm.controls; }

  changePwdForm: FormGroup;
  get passwdFrm() { return this.changePwdForm.controls; }

  showEmail = false;
  showOTP = false;
  showChangePwd = false;

  constructor(public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: Router ) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email_id: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
      password: ['', Validators.compose([Validators.required])],
    });
    this.dataService.console("login");

    this.emailForm = this.formBuilder.group({
      emailid : ['', Validators.compose([Validators.required, Validators.pattern('^(([^<>()[\\]\\.,;:\\s@"]+(\\.[^<>()[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')])],
    });

    this.changePwdForm = this.formBuilder.group({
      newPassword : ['', Validators.compose([Validators.required])],
      confirmPassword : ['', Validators.compose([Validators.required])],
    })
  }

  login() { //Login with post Method
    if (this.loginForm.status == 'VALID'){
      this.dataService.removeData("token")

      let req = this.loginForm.value;
      this.http.postMethod("users/login", req).then((response: any) => {
        console.log("response", response);
        this.dataService.authToken = response.token;
        this.dataService.setData("token", response.token);
        this.dataService.setData("userData", response.data);
        this.dataService.userProfile = response.data;
        if (response.data.role == 'ADMIN') {
          this.dataService.showSuccess("Success",response.message)
          this.dataService.navigateForward("admin/dashboard");
        }
        else{
          this.dataService.showError('Access Denied!','')
          this.router.navigateByUrl("/auth/login")
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      this.dataService.markFormGroupTouched(this.loginForm);
    }
   
  }

  forgotPassword(){
    this.showEmail = true;
    this.showOTP = false;
    this.showChangePwd = false;
    this.emailForm.reset();
  }
  onButtonClick(): void {
    this.buttonClicked.emit();
  }

  verifyEmail() {


    if(this.emailForm.status == 'VALID'){
      let req = {
        'email_id': this.emailForm.value.emailid
      }
  
      this.http.postMethod("users/forgotPassword", req).then((response: any) => {
        console.log(response);
        this.dataService.showSuccess("success", response.message);
        this.showOTP = true;
        this.showChangePwd = false;
        this.showEmail = false;
        
      }).catch((err) => {
        console.log(err);
      });
    }else {
      this.dataService.markFormGroupTouched(this.emailForm)
    }

  }

  onOtpChange(event){
    console.log("event", event);
    this.otp = event;
  }

  verifyOTP(){
    if(this.otp == '' || this.otp == undefined){
      this.dataService.showError("Error", 'Enter the OTP that we have sent to your registered Email.');
    }else{ 
    let req = {
      'email_id': this.emailForm.value.emailid,
      'otp': this.otp
    }

    this.http.postMethod("users/validate_otp", req).then((response: any) => {
      this.dataService.showSuccess("success", response.message);
      this.showOTP = false;
      this.showChangePwd = true;
      this.showEmail = false;
    }).catch((err) => {
      console.log(err);
    });
  }
  }

  changePass(){
    if((this.changePwdForm.value.confirmPassword && this.changePwdForm.value.newPassword) && this.changePwdForm.value.confirmPassword == this.changePwdForm.value.newPassword){ 
    let req = {
      "email_id": this.emailForm.value.emailid,
      "password": "",
      "newPassword":this.changePwdForm.value.confirmPassword,
    }

    this.http.postMethod("users/changePassword", req).then((response: any) => {
      this.dataService.showSuccess("success", response.message);
      this.showOTP = false;
      this.showChangePwd = false;
      this.showEmail = false;
      this.emailForm.reset();
      this.closeModal.nativeElement.click();
    }).catch((err) => {
      console.log(err);
    });
  }else{
    this.dataService.showError("Error", 'Please enter valid New password & Confirm Password');

  }
}

  otpPage(){
    this.showEmail = false;
    this.showOTP = true;
    this.showChangePwd = false;
  }

  emailVerifyPage(){
    this.showEmail = true;
    this.showOTP = false;
    this.showChangePwd = false;
  }

  changePwdPage(){
    this.showEmail = false;
    this.showOTP = false;
    this.showChangePwd = true;
  }

  backToOtpPage(){
    this.showEmail = false;
    this.showOTP = true;
    this.showChangePwd = false;
  }
}
