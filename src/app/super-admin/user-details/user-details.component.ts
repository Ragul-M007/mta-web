import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Location } from '@angular/common';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  flag: any;
  showAgent = false;
  showTechnician = false;
  refillingAgent: any;
  technician: any;
  taskHistory: any = [];
  techTask: any = [];
  projectDetails: any;
  imageChangedEvent: any;
  files: any;
  fileName: any;
  url: any;
  projectList: any = [];

  constructor(
    public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let temp = params["data"];

      this.projectDetails = JSON.parse(temp);
      if (this.projectDetails.documents == null) {
        this.projectDetails.documents = []
      }

    });
    this.getProjects();

    this.http
      .getMethod('users/updateusercounts')
      .then((response: any) => {
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getProjects() {
    this.http.getMethod("projects?user_id=" + this.projectDetails.user_id).then((response: any) => {
      this.projectList = response.data;
    }).catch((err) => {
      console.log(err);
    });
  }
  viewProjects(item) {
    this.router.navigate(["admin/viewproject"], { queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });
  }
  async fileChangeEvent(event: any) {

    this.imageChangedEvent = event;
    this.files = this.imageChangedEvent.target.files[0];
    this.fileName = this.files.name;
    this.url = await this.uploadFileToServer(this.files);

    let deleteconfirm = await this.dataService.showDelete("Document Upload", "Confirm to proceed with upload", "Confirm");
    if (deleteconfirm == true) {
      let user = this.dataService.userProfile;

      var req = {
        "file_name": this.fileName,
        "project_id": this.projectDetails.project_id,
        "category_id": this.projectDetails.category_id,
        "category_name": this.projectDetails.category_name,
        "file": this.url,
        "user_id": user.user_id

      }


      this.http.postMethod("projects/addDocument", req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);

      }).catch((err) => {
        console.log(err);
      });
    }
  }
  async uploadFileToServer(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (res) {
        resolve(res.target.result);

      };
      reader.onerror = function (err) {
        reject(err);
      };
    })
  }
  backClicked() {
    // this.router.navigate(["admin/userBack"], { queryParams: { 'data': 'viewUser' }, skipLocationChange: false })
    // this._location.back();
    this.route.queryParams.subscribe(params => {
      let temp = params["data"];
      temp = JSON.parse(temp);
      if(temp.from == 'admin'){
        this.router.navigate(['admin/profile']);
      }else {
        this.router.navigate(["admin/userBack"], { queryParams: { 'data': 'viewUser' }, skipLocationChange: true })
      }
    });

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
