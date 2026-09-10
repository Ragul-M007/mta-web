import { Component, ElementRef, HostListener, OnInit, ViewChild ,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
// import jsPDF from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { style } from '@angular/animations';
import { HttpService } from '../../service/http.service';
import { DataService } from '../../service/data.service';
import { ExcelServicesService } from '../../service/excel-services.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss'],
  encapsulation: ViewEncapsulation.None // Add this line

})
export class AttendanceReportComponent implements OnInit {

  useDetails: any = [];

  projectList: any = [];
  usersList: any = [];

  project_list: any = [];
  user_ids: any = [];
  selectedItems: any = [];

  @ViewChild('multiSelect') multiSelect: ElementRef;
  @ViewChild('dateinput') dateinput: ElementRef;
  @ViewChild('dateinputend') dateinputend: ElementRef;
  excelForm: FormGroup;


  swipeLimitWidth = 80;
  connectEdges = true;
  dropdownSettings: any = {};
  userdropdownSetting: any = {};

  fromDate: any;
  endDate: any;

  selectDatas: any = [{
    id: 1,
    name: "Projects",
    disabled: false

  }, {
    id: 2,
    name: "Users",
    disabled: false

  }]

  viewExport: boolean = false;


  usersinProject: any = [];
  excel: any = [];
  typeofData: string;
  showProjectSelecterror: boolean = false;
  showUserSelecterror: boolean = false;
  error: boolean = false;
  checkboxError: boolean = false;
  viewExportForusers: boolean;
  showUserOptions: boolean = false;
  showProjectDrop: boolean = false;
  futureDate: boolean = false;
  futureDate2: boolean = false;
  notValidDate: boolean = false;
  disableSelectAll: boolean = false;
  dateContent: string;
  notValidDate2: boolean = false;
  notValidDate3: boolean = false;
  noData: boolean = false;
  dateContent2: any;
  submitButtonForProject: boolean = false;
  submitForUsers: boolean = false;

  get form() {
    return this.excelForm.controls;
  }
  constructor(private http: HttpService, private dataService: DataService, public fb: FormBuilder, public excelService: ExcelServicesService) {
  }

  ngOnInit(): void {
    this.useDetails = this.dataService.getData("userData");
    // this.getProjects();

    this.excelForm = this.fb.group({
      multiselectfc: ['', []],
      userMultiselct: ['', []],
      fromdate: ['', Validators.compose([])]
    });

    var today = new Date().toISOString().split('T')[0];
    document.getElementById('date-input').setAttribute('max', today);

    var today2 = new Date().toISOString().split('T')[0];
    document.getElementById('to-input').setAttribute('max', today2);

    this.userdropdownSetting = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'name',
      // textField: 'project_name',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      clearSearchFilter: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "No results matched your search!",
      allowRemoteDataSearch: false
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'project_id',
      textField: 'project_name',
      // textField: 'project_name',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "No results matched your search!",
      allowRemoteDataSearch: false

    }

  }


  showDetails(event, id) {

    this.selectOneCheckbox(id);
    if (id == 1 && event.target.checked == true) {
      this.showProjectDrop = true;
      this.showUserOptions = false;
      this.dateinput.nativeElement.value = '';
      this.dateinputend.nativeElement.value = '';
      this.fromDate = '';
      this.endDate = '';
      this.futureDate = false;
      this.futureDate2 = false;
      this.notValidDate = false;
      this.notValidDate2 = false;
      this.notValidDate3 = false;
      this.error = false;
      this.noData = false;
      this.excelForm.get('userMultiselct').setValue([]);
      this.typeofData = "project";
      this.checkboxError = false;
      this.viewExportForusers = false;
      this.showUserSelecterror = false;
      this.submitButtonForProject = false;
      this.submitForUsers = false;
      this.usersList = [];
      this.projectList = [];
      this.project_list = [];
      this.user_ids = [];
      this.viewExport = false;
      this.getProjects();
      // const userCheckbox = this.selectDatas.find(data => data.id === 2);
      // if (userCheckbox) {
      //   userCheckbox.disabled = event.target.checked;
      // }

      if ((this.endDate == undefined || null) || (this.fromDate == undefined || null)) {
        this.error = true;
        if (this.endDate == undefined || null) {
          this.dateContent2 = "To Date";
          this.notValidDate3 = false;
        }
        if (this.fromDate == undefined || null) {
          this.dateContent2 = "From Date";
          this.notValidDate2 = false;
        }
        if ((this.endDate == undefined || null) && (this.fromDate == undefined || null)) {
          this.dateContent2 = "From Date & To Date";
          this.notValidDate3 = false;
          this.notValidDate2 = false;
        }

      }
    }
    if (id == 2 && event.target.checked == true) {
      this.showUserOptions = true;
      this.showProjectDrop = false;
      this.noData = false;
      this.dateinput.nativeElement.value = '';
      this.dateinputend.nativeElement.value = '';
      this.fromDate = '';
      this.endDate = '';
      this.futureDate = false;
      this.futureDate2 = false;
      this.notValidDate = false;
      this.notValidDate2 = false;
      this.notValidDate3 = false;
      this.error = false;
      this.excelForm.get('multiselectfc').setValue([]);
      this.checkboxError = false;
      this.viewExportForusers = false;
      this.showProjectSelecterror = false;
      this.typeofData = "user";
      this.usersList = [];
      this.selectedItems = [];
      this.projectList = [];
      this.project_list = [];
      this.user_ids = [];
      this.viewExport = false;
      this.getUsers();
      this.submitButtonForProject = false;
      this.submitForUsers = false;
      // const projectsCheckbox = this.selectDatas.find(data => data.id === 1);
      // if (projectsCheckbox) {
      //   projectsCheckbox.disabled = event.target.checked;

      // }
      if ((this.endDate == undefined || null) || (this.fromDate == undefined || null)) {
        this.error = true;
        if (this.endDate == undefined || null) {
          this.dateContent2 = "To Date";
          this.notValidDate3 = false;
        }
        if (this.fromDate == undefined || null) {
          this.dateContent2 = "From Date";
          this.notValidDate2 = false;
        }
        if ((this.endDate == undefined || null) && (this.fromDate == undefined || null)) {
          this.dateContent2 = "From Date & To Date";
          this.notValidDate3 = false;
          this.notValidDate2 = false;
        }

      }
    }
    if ((id == 2 && event.target.checked == false) || (id == 1 && event.target.checked == false)) {
      this.checkboxError = true;
      this.projectList = [];
      this.usersList = [];
      this.excelForm.get('userMultiselct').setValue([]);
      this.excelForm.get('multiselectfc').setValue([]);
      this.showProjectDrop = false;
      this.showUserOptions = false;
      this.viewExport = false;
      this.viewExportForusers = false;
      this.showProjectSelecterror = false;
      this.showUserSelecterror = false;

      // if (id == 1) {
      //   const userCheckbox = this.selectDatas.find(data => data.id === 2);
      //   if (userCheckbox) {
      //     userCheckbox.disabled = event.target.checked;
      //     this.typeofData = '';
      //     this.projectList = [];
      //     this.project_list = [];
      //   }
      // }
      // if (id == 2) {
      //   const projectsCheckbox = this.selectDatas.find(data => data.id === 1);
      //   if (projectsCheckbox) {
      //     projectsCheckbox.disabled = event.target.checked;
      //     this.typeofData = '';
      //     this.usersList = [];
      //     this.user_ids=[];
      //   }
      // }


    }
  }


  getProjects() {
    this.http.getMethod("projects?user_id=" + this.useDetails.user_id).then((response: any) => {
      this.projectList = response.data;

    }).catch((err) => {
      console.log(err);
    });
  }

  getUsers() {
    this.http.getMethod("users/getUserList").then((response: any) => {
      this.usersList = response.data;
    }).catch((err) => {
      console.log("errr", err)
    })
  }

  onprojectSelect(e: any) {
    this.project_list.push(e.project_id);

    // this.getUsersFrom(e)
    // this.getprojectsExcel(this.project_list);
    this.showProjectSelecterror = false;
    this.submitButtonForProject = true;
    this.viewExport = false;
  }

  onprojectDeSelect(e) {

    var final;
    if (this.project_list.length > 0) {

      final = this.project_list.filter((id: any) => {
        if (e.project_id != id) {
          return id;
        }
      })
    } else {
      this.showProjectSelecterror = true;
      this.submitButtonForProject = false;
      this.viewExport = false;
      this.project_list = [];
    }


    if ((final != undefined || null) && (final.length > 0)) {
      this.excel = [];
      this.project_list = final;
      // this.getprojectsExcel(this.project_list);
      this.showProjectSelecterror = false;
      this.submitButtonForProject = true;
      this.viewExport = false;
    }
    else {
      this.viewExport = false;
      this.showProjectSelecterror = true;
      this.submitButtonForProject = false;
      this.viewExport = false;
      this.project_list = [];

    }

  }

  onSelectAllProject(event) {

    let projects = event;
    for (let i = 0; i < projects.length; i++) {
      this.project_list.push(projects[i].project_id);
    }

    if ((this.project_list != undefined || null) && (this.project_list.length > 0)) {
      this.excel = [];
      // this.getprojectsExcel(this.project_list);
      this.showProjectSelecterror = false;
      this.submitButtonForProject = true;
      this.viewExport = false;
    }
    else {
      this.viewExport = false;
      this.submitButtonForProject = false;
      this.showProjectSelecterror = true;
      this.project_list = [];

    }
  }

  onUnSelectAllProject() {
    this.showProjectSelecterror = true;
    this.project_list = [];
    this.viewExport = false;
    this.submitButtonForProject = false;
  }


  onuserSelect(e: any) {

    this.user_ids.push(e.user_id);
    // this.getUsersDetailsExcel(this.user_ids);
    this.submitForUsers = true;
    this.viewExportForusers = false;
    if ((this.user_ids != undefined || null) && (this.user_ids.length > 0)) {
      this.showUserSelecterror = false;
    }
  }

  onuserDeSelect(e: any) {

    var final;
    if (this.user_ids.length > 0) {
      final = this.user_ids.filter((id: any) => {
        if (e.user_id != id) {
          return id;
        }
      })
    } else {
      this.showUserSelecterror = true;
      this.viewExportForusers = false;
      this.user_ids = [];
      this.viewExportForusers = false;

    }


    if ((final != undefined || null) && (final.length > 0)) {
      this.excel = [];
      this.user_ids = final;
      // this.getUsersDetailsExcel(this.user_ids);
      this.submitForUsers = true;
      this.viewExportForusers = true;
      this.viewExportForusers = false;
    } else {
      this.submitForUsers = false;
      this.viewExportForusers = false;
      this.showUserSelecterror = true;
      this.user_ids = [];

    }
  }

  onSelectAllUsers(event) {
    let users = event;
    for (let i = 0; i < users.length; i++) {
      this.user_ids.push(users[i].user_id);
    }

    if ((this.user_ids != undefined || null) && (this.user_ids.length > 0)) {
      this.excel = [];
      // this.getUsersDetailsExcel(this.user_ids);
      this.submitForUsers = true;
      this.showUserSelecterror = false;
      this.viewExportForusers = false;
    }
    else {
      this.viewExportForusers = false;
      this.showUserSelecterror = true;
      this.submitForUsers = false;
      this.user_ids = [];

    }
  }

  onUnSelectAllUsers() {
    this.viewExportForusers = false;
    this.showUserSelecterror = true;
    this.user_ids = [];
    this.submitForUsers = false;
  }

  selectOneCheckbox(id) {
    const checkboxes = document.querySelectorAll('.checkboxselect input[type="checkbox"]');
    checkboxes.forEach((item) => {
      const item1 = item as HTMLInputElement;
      if (parseInt(item.id, 10) !== parseInt(id, 10)) {
        item1.checked = false;
      }
    });
  }


  getFromDate(e) {

    if (e.target.placeholder == "From date") {
      this.fromDate = e.target.value;

      const currentDate = new Date();
      this.submitButtonForProject = false;
      this.viewExportForusers = false;
      this.submitForUsers = false;
      this.viewExport = false;

      // Parse the input date
      const parsedInputDate = new Date(this.fromDate);
      const endDate = new Date(this.endDate);
      if (parsedInputDate.getFullYear() == currentDate.getFullYear()) {
      } else {
        this.dateinputend.nativeElement.value = '';
        document.getElementById('to-input').setAttribute('min', this.fromDate);
        this.endDate = '';
      }
      if (parsedInputDate > currentDate) {
        this.futureDate = true;
        this.notValidDate = false;
        this.dateinput.nativeElement.value = '';
      }

      else {
        this.futureDate = false;
        if ((endDate < parsedInputDate) || (parsedInputDate.getFullYear() < 2010) || isNaN(parsedInputDate.getTime())) {
          this.notValidDate = true;
          this.notValidDate3 = true;
          this.dateContent = "EndDate";
          // this.dateinput.nativeElement.value = '';
        }
        else {
          this.notValidDate = false;
          this.notValidDate3 = false;
          this.dateContent = '';
        }
      }

    }
    if (e.target.placeholder == "End date") {
      this.endDate = e.target.value;
      this.submitButtonForProject = false;
      this.viewExportForusers = false;
      this.submitForUsers = false;
      this.viewExport = false;
      document.getElementById('date-input').setAttribute('max', this.endDate);
      const currentDate = new Date();
      // Parse the input date
      const parsedInputDate = new Date(this.endDate);
      const fromDate = new Date(this.fromDate);
      if (parsedInputDate > currentDate) {
        this.futureDate2 = true;
        this.notValidDate = false;
        this.dateinputend.nativeElement.value = '';
      }
      else {
        this.futureDate2 = false;
        if ((parsedInputDate < fromDate) || (parsedInputDate.getFullYear() < 2010) || isNaN(parsedInputDate.getTime())) {
          this.notValidDate = true;
          this.notValidDate2 = true;
          this.dateContent = "FromDate";

          // this.dateinputend.nativeElement.value = '';

        }
        else {
          this.notValidDate = false;
          this.notValidDate2 = false;
          this.dateContent = '';

        }
      }

    }
    if ((this.fromDate) && (this.endDate)) {
      this.error = false;

      if ((this.typeofData == undefined || null) || (this.typeofData.length == 0)) {
        this.checkboxError = true;

      } else {

        this.checkboxError = false;
        if (this.typeofData == "project") {
          this.showProjectSelecterror = false;
        }
        else if (this.typeofData == "user") {
          this.showUserSelecterror = false;
        }
      }


      if ((this.project_list != undefined || null) && (this.project_list.length > 0) && (this.futureDate == false) && (this.futureDate2 == false) && (this.notValidDate == false)) {
        // this.getprojectsExcel(this.project_list);
        this.submitButtonForProject = true;
      }
      else if ((this.user_ids != undefined || null) && (this.user_ids.length > 0) && (this.futureDate == false) && (this.futureDate2 == false) && (this.notValidDate == false)) {
        // this.getUsersDetailsExcel(this.user_ids);
        this.submitForUsers = true;
      }
      else if ((this.user_ids.length == 0) && (this.typeofData == "user") && (this.futureDate == false) && (this.futureDate2 == false)) {
        this.showUserSelecterror = true;
        this.submitButtonForProject = false;
        this.submitForUsers = false;
      }
      else if ((this.project_list.length == 0) && (this.typeofData == "project") && (this.futureDate == false) && (this.futureDate2 == false)) {
        this.showProjectSelecterror = true;
        this.submitButtonForProject = false;
        this.submitForUsers = false;
      }
    } else {
      this.error = true;

      if (!this.endDate && !this.fromDate) {
        this.dateContent2 = "From Date & To Date";
      }

      if (((this.endDate?.length < 1) || (this.endDate == undefined || null)) && (this.fromDate?.length > 0)) {
        this.dateContent2 = "To Date";
      }

      if (((this.fromDate?.length < 1) || (this.fromDate == undefined || null)) && (this.endDate?.length > 0)) {
        this.dateContent2 = "From Date";
      }

      if (this.notValidDate == true || this.futureDate == true || this.futureDate2 == true) {
        this.error = false;
      }
    }
  }

  accessforDownload() {
    if ((this.typeofData != undefined || null) && (this.fromDate != undefined || null) && (this.fromDate.length > 0) && (this.endDate.length > 0) && (this.endDate != undefined || null) && (this.futureDate == false) && (this.futureDate2 == false) && (this.notValidDate == false)) {
      this.getprojectsExcel(this.project_list);
    } else {
      this.dateContent2 = '';
      this.error = true;

      if (!this.endDate && !this.fromDate) {
        this.dateContent2 = "From Date & To Date";
      }

      if (((this.endDate.length < 1) || (this.endDate == undefined || null)) && (this.fromDate.length > 0)) {
        this.dateContent2 = "To Date";
      }

      if (((this.fromDate.length < 1) || (this.fromDate == undefined || null)) && (this.endDate.length > 0)) {
        this.dateContent2 = "From Date";
      }

      if (this.futureDate || this.futureDate2) {
        this.futureDate = true;
      }

      if (this.notValidDate == true || this.futureDate == true || this.futureDate2 == true) {
        this.error = false;
      }
      this.excel = [];
      this.viewExport = false;
    }
  }

  accessforDownload2() {
    if ((this.typeofData != undefined || null) && (this.fromDate != undefined || null) && (this.endDate != undefined || null) && (this.fromDate.length > 0) && (this.endDate.length > 0) && (this.futureDate == false) && (this.futureDate2 == false) && (this.notValidDate == false)) {
      this.getUsersDetailsExcel(this.user_ids);
    } else {

      this.dateContent2 = '';
      this.error = true;
      if (!this.endDate && !this.fromDate) {
        this.dateContent2 = "From Date & To Date";
      }

      if (((this.endDate.length < 1) || (this.endDate == undefined || null)) && (this.fromDate.length > 0)) {
        this.dateContent2 = "To Date";
      }

      if (((this.fromDate.length < 1) || (this.fromDate == undefined || null)) && (this.endDate.length > 0)) {
        this.dateContent2 = "From Date";
      }

      if (this.futureDate || this.futureDate2) {
        this.futureDate = true;
      }
      if (this.notValidDate == true || this.futureDate == true || this.futureDate2 == true) {
        this.error = false;
      }
      this.excel = [];
      this.viewExportForusers = false;
    }
  }


  getprojectsExcel(project_ids: []) {

    if ((this.typeofData != undefined || null) && (this.fromDate != undefined || null) && (this.fromDate.length > 0) && (this.endDate.length > 0) && (this.endDate != undefined || null) && (this.futureDate == false) && (this.futureDate2 == false) && (this.notValidDate == false)) {
      let payload = {
        "from_date": this.fromDate,
        "to_date": this.endDate,
        "project_ids": project_ids,
        "user_ids": null,
        "type": this.typeofData
      }

      this.http.postMethod('attendance/attendanceReport', payload).then((reponse: any) => {

        if (reponse.status == true) {
          this.excel = reponse.data;
          this.viewExport = true;
        }
      }).catch((err) => {
        console.log('err', err)
      });
    }
    else {
      this.dateContent2 = '';
      this.error = true;

      if (!this.endDate && !this.fromDate) {
        this.dateContent2 = "From Date & To Date";
      }

      if (((this.endDate.length < 1) || (this.endDate == undefined || null)) && (this.fromDate.length > 0)) {
        this.dateContent2 = "To Date";
      }

      if (((this.fromDate.length < 1) || (this.fromDate == undefined || null)) && (this.endDate.length > 0)) {
        this.dateContent2 = "From Date";
      }

      if (this.futureDate || this.futureDate2) {
        this.futureDate = true;
      }

      if (this.notValidDate == true || this.futureDate == true || this.futureDate2 == true) {
        this.error = false;
      }
      this.excel = [];
      this.viewExport = false;
    }

  }

  getUsersDetailsExcel(user_ids) {

    if ((this.typeofData != undefined || null) && (this.fromDate != undefined || null) && (this.endDate != undefined || null) && (this.fromDate.length > 0) && (this.endDate.length > 0) && (this.futureDate == false) && (this.futureDate2 == false) && (this.notValidDate == false)) {
      let payload = {
        "from_date": this.fromDate,
        "to_date": this.endDate,
        "project_ids": null,
        "user_ids": user_ids,
        "type": this.typeofData
      }

      this.http.postMethod('attendance/attendanceReport', payload).then((reponse: any) => {

        if (reponse.status == true) {
          this.excel = reponse.data;
          this.viewExportForusers = true;
        }

      }).catch((err) => {
        console.log('err', err)
      });
    }
    else {

      this.dateContent2 = '';
      this.error = true;
      if (!this.endDate && !this.fromDate) {
        this.dateContent2 = "From Date & To Date";
      }

      if (((this.endDate.length < 1) || (this.endDate == undefined || null)) && (this.fromDate.length > 0)) {
        this.dateContent2 = "To Date";
      }

      if (((this.fromDate.length < 1) || (this.fromDate == undefined || null)) && (this.endDate.length > 0)) {
        this.dateContent2 = "From Date";
      }

      if (this.futureDate || this.futureDate2) {
        this.futureDate = true;
      }
      if (this.notValidDate == true || this.futureDate == true || this.futureDate2 == true) {
        this.error = false;
      }
      this.excel = [];
      this.viewExportForusers = false;
    }
  }

  exportExcel() {

    this.excelService.exportAsExcelFiletest(this.excel, "Project details");
  }
  exportUserExcel() {

    this.excelService.exportAsExcelFileuser(this.excel, "User Detatils");
  }



  exportAsPdfMain() {

    let projects = this.excel;


    let headerDetails = '<table style="margin-bottom:5px;padding:0px;height:0px;border:none;"><tr><td style="border:none;margin-top: 0;width:75%;"></td><td style="width:25%;border:none;margin-top: 0;"><h5 style="font-size:1.2em;padding:0;margin:0;font-weight: normal;margin-left:2em;">' + "MTA" + '</h5></td></tr></table>';
    let line = '<hr data-pdfmake="{ &quot;widths&quot;:[100,&quot;*&quot;,&quot;auto&quot;], &quot;color&quot;:&quot;blue&quot;, &quot;margin&quot;:[0,5,0,0], &quot;thickness&quot;:0.5, &quot;border-style&quot;:&quot;dashed&quot;}">';

    let br = '<br>'


    let projectdetails = '<table style="margin:0;padding:0;border:none;"><tr><td style="border:none;border-top:0px;width:100%;"><table>';

    for (let i = 0; i < this.excel?.length; i++) {

      projectdetails = projectdetails + '<tr><td style="width:100%;border:none;font-size:1.3em;font-weight:400;">' + 'Project Name: ' + '  ' + this.excel[i]?.project_name + '</td></tr>';

      let userdetails = '<table style="margin:0;padding:0;border:none;"><tr><td style="border:none;border-top:0px;width:100%;"><table>';

      for (let j = 0; j < this.excel[i]?.project_details?.length; j++) {
        userdetails = userdetails + '<tr><td style="width:40%;border:none;font-size:1em;font-weight:400;">' + this.excel[i]?.project_details[j]?.user_name + '</td></tr>';

        let userdatas = '<table style="margin:0;padding:0;border:none;"><tr><td style="border:none;border-top:0px;width:100%;"><table>';
        let dataheader = '<table><tr><td style="width:30%;border:none;font-size:0.9em;font-weight:400;">' + 'Date' + '</td><td style="width:30%;border:none;font-size:0.9em;font-weight:400;">' + 'Total Workhours' + '</td></tr></table>';

        for (let k = 0; k < this.excel[i]?.project_details[j]?.user_details?.length; k++) {
          userdatas = userdatas + '<tr><td style="width:30%;border:none;font-size:0.7em;font-weight:400;">' + this.excel[i]?.project_details[j]?.user_details[k]?.date + '</td><td style="width:30%;border:none;font-size:0.7em;font-weight:400;">' + this.excel[i]?.project_details[j]?.user_details[k]?.totalWorkHours + '</td></tr>';
        }

        // if (this.excel[i]?.project_details[j]?.length - 1) {
        //   let br = '<br>'
        //   userdetails += dataheader + userdatas + br +'</table></td></tr></table>';
        // }

        userdetails += dataheader + userdatas + '</table></td></tr></table>';

      }

      projectdetails += userdetails + '</table></td></tr></table>';

    }

    projectdetails = projectdetails + '</td></tr></table>';

    let html = '';


    html = headerDetails + line + br + projectdetails;


    var pdfFormation = htmlToPdfmake(html, {
      tableAutoSize: true,
      footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
    });

    var docDefinition = {
      content: [
        pdfFormation,
      ],
      footer: function (currentPage, pageCount) {
        return {
          alignment: 'center',
          text: 'thank you',
          fontSize: 9,
          // color: '#f6912f',
          bold: true,
        }
      },
      pageBreakBefore: function (currentNode) {
        return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
      }, styles: {
        'bold': {
          bold: true
        },
      }
    };

    pdfMake.createPdf(docDefinition).download('project' + "_detail" + '.pdf');

  }


  exportAsPdf() {

    const batchSize = 30;
    const totalProjects = this.excel.length;
    const pdfFiles = [];

    for (let i = 0; i < totalProjects; i += batchSize) {
      const batchProjects = this.excel.slice(i, i + batchSize);
      const projectDetails = generateProjectDetails(batchProjects);


      const pdfFormation = htmlToPdfmake(projectDetails, {});
      pdfFiles.push({
        content: pdfFormation,
        fileName: `Project Detail Report.pdf`,
      });

    }

    pdfFiles.forEach((pdfFile, index) => {

      var docDefinition = {
        content:
          pdfFile.content,
        pageBreakBefore: function (currentNode) {
          return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
        }, styles: {
          'bold': {
            bold: true
          },
        }
      };

      if (docDefinition && docDefinition) {
        pdfMake.createPdf(docDefinition).download(pdfFile.fileName);
      }

    });

    function generateProjectDetails(batchProjects) {
      let headerDetails = '<table style="margin:0;padding:0px;height:0px;border:none; width: 100%;"><tr><td style="border:none; margin-left:600px"><h2 style="font-weight: 500;">' + 'MTA' + '</h2></td></tr></table>';
      let line = '<hr data-pdfmake="{ &quot;widths&quot;:[100,&quot;*&quot;,&quot;auto&quot;], &quot;color&quot;:&quot;blue&quot;, &quot;margin&quot;:[0,5,0,0], &quot;thickness&quot;:0.5, &quot;border-style&quot;:&quot;dashed&quot;}">';

      let br = '<br>'

      let details = '';

      batchProjects.forEach(project => {
        details += '<table style="margin:0;padding:0;border:none;width:100%;">';

        details = details + '<tr><td style="margin:0;width:100%;border:none;font-size:1.3em;font-weight:400;color:#3b5998;">' + 'Project Name: ' + project.project_name + '</td></tr>';

        let userdetails = '<table style="margin-top:10px;margin-bottom:5px;padding:0;border:none;">';

        if (project?.project_details?.length > 0 && Array.isArray(project?.project_details)) {
          for (let j = 0; j < project?.project_details?.length; j++) {
            userdetails = userdetails + '<tr><td style="margin-bottom:5px;width:40%;border:none;font-size:1em;font-weight:400;">' + project.project_details[j].user_name + '</td></tr>';

            let userdatas = '<table style="margin-bottom:5px;padding:0;border:none;"><tr><td style="width:30%;border:none;font-size:0.9em;font-weight:400;">' + 'Date' + '</td><td style="width:30%;border:none;font-size:0.9em;font-weight:400;">' + 'Total Workhours' + '</td></tr>';

            if (project?.project_details[j]?.user_details?.length > 0 && Array.isArray(project?.project_details[j]?.user_details)) {
              // forloop starts here
              for (let k = 0; k < project?.project_details[j]?.user_details?.length; k++) {
                userdatas = userdatas + '<tr><td style="width:30%;margin-bottom:5px;border:none;font-size:0.7em;font-weight:400;">' + project.project_details[j].user_details[k].date + '</td><td style="width:30%;border:none;font-size:0.7em;font-weight:400;">' + project.project_details[j].user_details[k].totalWorkHours + '</td></tr>';
              }

            }
            else {
              userdatas = userdatas + '<tr><td style="width:30%;border:none;font-size:0.7em;font-weight:400;">' + "No Data Found" + '</td><td style="width:30%;border:none;font-size:0.7em;font-weight:400;">' + "No Data Found" + '</td></tr>';
            }


            userdetails += userdatas + '</table>';
          }
        } else {
          userdetails = userdetails + '<tr><td style="width:40%;border:none;font-size:1em;font-weight:400;">' + "No Data Found" + '</td></tr>';
        }


        details += userdetails + '</table>';
      });

      details += '</table>';

      return headerDetails + line + br + details;
    }
  }


  exportAsPdfUser() {

    let projects = this.excel;
    if (this.excel) {
      this.excel.filter((user) => {
      })

    }

    let headerDetails = '<table style="margin-bottom:5px;padding:0px;height:0px;border:none;"><tr><td style="border:none;margin-top: 0;width:75%;"></td><td style="width:25%;border:none;margin-top: 0;"><h5 style="font-size:1.2em;padding:0;margin:0;font-weight: normal;margin-left:2em;">' + "MTA" + '</h5></td></tr></table>';
    let line = '<hr data-pdfmake="{ &quot;widths&quot;:[100,&quot;*&quot;,&quot;auto&quot;], &quot;color&quot;:&quot;blue&quot;, &quot;margin&quot;:[0,5,0,0], &quot;thickness&quot;:0.5, &quot;border-style&quot;:&quot;dashed&quot;}">';

    let br = '<br>'
    let userdetails = '<table style="margin:0;padding:0;border:none;width:100%;">';
    for (let i = 0; i < this.excel?.length; i++) {

      userdetails = userdetails + '<tr><td style="width:100%;margin-bottom:6px;border:none;font-size:1.3em;font-weight:400;color:#000000">' + 'User Name: ' + ' ' + this.excel[i]?.user_name + '</td></tr>';
      let projectdetails = '<table style="margin-top:5px;padding:0;border:none;">';
      for (let j = 0; j < this.excel[i]?.user_details?.length; j++) {
        if ((this.excel[i]?.user_details[j]?.project_details?.length > 0) && Array.isArray(this.excel[i]?.user_details[j]?.project_details)) {
          projectdetails = projectdetails + '<tr><td style="width:100%;border:none;font-size:1em;font-weight:400;">' + this.excel[i]?.user_details[j]?.project_name + '</td></tr>';

          let projectDatas = '<table style="margin-bottom:13px;padding:0;border:none;"><tr><td style="width:20%;border:none;font-size:0.9em;font-weight:400;">' + 'Date' + '</td><td style="width:80%;border:none;font-size:0.9em;font-weight:400;">' + 'Total Workhours' + '</td></tr>';
          for (let k = 0; k < this.excel[i]?.user_details[j]?.project_details?.length; k++) {
            projectDatas = projectDatas + '<tr style="border:dotted;"><td style="width:20%;border:dotted;font-size:0.7em;font-weight:400;">' + this.excel[i]?.user_details[j]?.project_details[k]?.date + '</td><td style="width:80%;border:dotted;font-size:0.7em;font-weight:400;">' + this.excel[i]?.user_details[j]?.project_details[k]?.totalWorkHours + '</td></tr>';
          }
  
          projectdetails += projectDatas + '</table>';
        }
        else {
          projectdetails = projectdetails + '<tr><td style="width:100%;margin-bottom:10px;border:none;font-size:1em;font-weight:400;">' + this.excel[i]?.user_details[j]?.project_name + '</td></tr>';
        }
    

      }
      userdetails += projectdetails + '</table>';
    }

    userdetails = userdetails + '</table>';

    let html = '';


    html = headerDetails + line + br + userdetails;


    var pdfFormation = htmlToPdfmake(html, {
      tableAutoSize: true,
      footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
    });

    var docDefinition = {
      content: [
        pdfFormation,
      ],
      footer: function (currentPage, pageCount) {
        return {
          alignment: 'center',
          text: 'thank you',
          fontSize: 9,
          // color: '#f6912f',
          bold: true,
        }
      },
      pageBreakBefore: function (currentNode) {
        return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
      }, styles: {
        'bold': {
          bold: true
        },
      }
    };

    pdfMake.createPdf(docDefinition).download('User' + "_detail" + '.pdf');

  }

  exportPdfProcheck(){
    let projects = this.excel;
    if (this.excel) {
      this.excel.filter((user) => {
      })

    }

    let headerDetails = '<table style="margin:0;padding:0px;height:0px;border:none; width: 100%;"><tr><td style="border:none; margin-left:600px"><h2 style="font-weight: 500;">' + 'MTA' + '</h2></td></tr></table>';
    let line = '<hr data-pdfmake="{ &quot;widths&quot;:[100,&quot;*&quot;,&quot;auto&quot;], &quot;color&quot;:&quot;blue&quot;, &quot;margin&quot;:[0,5,0,0], &quot;thickness&quot;:0.5, &quot;border-style&quot;:&quot;dashed&quot;}">';

    let br = '<br>'

    let details = '';

    this.excel.forEach(project => {
      details += '<table style="margin:0;padding:0;border:none;width:100%;">';

      details = details + '<tr><td style="margin:0;width:100%;border:none;font-size:1.3em;font-weight:400;color:#3b5998;">' + 'Project Name: ' + project.project_name + '</td></tr>';

      let userdetails = '<table style="margin-top:10px;margin-bottom:5px;padding:0;border:none;">';

      if (project?.project_details?.length > 0 && Array.isArray(project?.project_details)) {
        for (let j = 0; j < project?.project_details?.length; j++) {
          userdetails = userdetails + '<tr><td style="margin-bottom:5px;width:40%;border:none;font-size:1em;font-weight:400;">' + project.project_details[j].user_name + '</td></tr>';

          let userdatas = '<table style="margin-bottom:5px;padding:0;border:none;"><tr><td style="width:20%;border:none;font-size:0.9em;font-weight:400;">' + 'Date' + '</td><td style="width:80%;border:none;font-size:0.9em;font-weight:400;">' + 'Total Workhours' + '</td></tr>';

          if (project?.project_details[j]?.user_details?.length > 0 && Array.isArray(project?.project_details[j]?.user_details)) {
            // forloop starts here
            for (let k = 0; k < project?.project_details[j]?.user_details?.length; k++) {
              userdatas = userdatas + '<tr><td style="width:20%;margin-bottom:5px;border:none;font-size:0.7em;font-weight:400;">' + project.project_details[j].user_details[k].date + '</td><td style="width:80%;border:none;font-size:0.7em;font-weight:400;">' + project.project_details[j].user_details[k].totalWorkHours + '</td></tr>';
            }

          }
          else {
            userdatas = userdatas + '<tr><td style="width:30%;border:none;font-size:0.7em;font-weight:400;">' + "No Data Found" + '</td><td style="width:30%;border:none;font-size:0.7em;font-weight:400;">' + "No Data Found" + '</td></tr>';
          }


          userdetails += userdatas + '</table>';
        }
      } else {
        userdetails = userdetails + '<tr><td style="width:40%;border:none;font-size:1em;font-weight:400;">' + "No Data Found" + '</td></tr>';
      }


      details += userdetails + '</table>';
    });

    details += '</table>';

  
    let html = '';


    html = headerDetails + line + br + details;

    // let headerDetails = '<table style="margin-bottom:5px;padding:0px;height:0px;border:none;"><tr><td style="border:none;margin-top: 0;width:75%;"></td><td style="width:25%;border:none;margin-top: 0;"><h5 style="font-size:1.2em;padding:0;margin:0;font-weight: normal;margin-left:2em;">' + "MTA" + '</h5></td></tr></table>';
    // let line = '<hr data-pdfmake="{ &quot;widths&quot;:[100,&quot;*&quot;,&quot;auto&quot;], &quot;color&quot;:&quot;blue&quot;, &quot;margin&quot;:[0,5,0,0], &quot;thickness&quot;:0.5, &quot;border-style&quot;:&quot;dashed&quot;}">';

    // let br = '<br>'
    // let userdetails = '<table style="margin:0;padding:0;border:none;width:100%;">';
    // for (let i = 0; i < this.excel?.length; i++) {

    //   userdetails = userdetails + '<tr><td style="width:100%;margin-bottom:6px;border:none;font-size:1.3em;font-weight:400;color:#000000">' + 'Project Name:' + ' ' + this.excel[i]?.project_name + '</td></tr>';
    //   let projectdetails = '<table style="margin-top:5px;padding:0;border:none;">';
    //   for (let j = 0; j < this.excel[i]?.project_details?.length; j++) {
    //     if ((this.excel[i]?.project_details[j]?.user_details?.length > 0) && Array.isArray(this.excel[i]?.project_details[j]?.user_details)) {
    //       projectdetails = projectdetails + '<tr><td style="width:100%;border:none;font-size:1em;font-weight:400;">' + this.excel[i]?.project_details[j]?.user_name + '</td></tr>';

    //       let projectDatas = '<table style="margin-bottom:13px;padding:0;border:none;"><tr><td style="width:20%;border:none;font-size:0.9em;font-weight:400;">' + 'Date' + '</td><td style="width:80%;border:none;font-size:0.9em;font-weight:400;">' + 'Total Workhours' + '</td></tr>';
    //       for (let k = 0; k < this.excel[i]?.project_details[j]?.user_details?.length; k++) {
    //         projectDatas = projectDatas + '<tr style="border:dotted;"><td style="width:20%;border:dotted;font-size:0.7em;font-weight:400;">' + this.excel[i]?.project_details[j]?.user_details[k]?.date + '</td><td style="width:80%;border:dotted;font-size:0.7em;font-weight:400;">' + this.excel[i]?.project_details[j]?.user_details[k]?.totalWorkHours + '</td></tr>';
    //       }
  
    //       projectdetails += projectDatas + '</table>';
    //     }
    //     else {
    //       projectdetails = projectdetails + '<tr><td style="width:100%;margin-bottom:10px;border:none;font-size:1em;font-weight:400;">' + this.excel[i]?.project_details[j]?.user_name + '</td></tr>';
    //     }
    

    //   }
    //   userdetails += projectdetails + '</table>';
    // }

    // userdetails = userdetails + '</table>';

    // let html = '';


    // html = headerDetails + line + br + userdetails;


    var pdfFormation = htmlToPdfmake(html, {
      tableAutoSize: true,
      footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
    });

    var docDefinition = {
      content: [
        pdfFormation,
      ],
      footer: function (currentPage, pageCount) {
        return {
          alignment: 'center',
          text: 'thank you',
          fontSize: 9,
          // color: '#f6912f',
          bold: true,
        }
      },
      pageBreakBefore: function (currentNode) {
        return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
      }, styles: {
        'bold': {
          bold: true
        },
      }
    };

    pdfMake.createPdf(docDefinition).download('project' + "_detail" + '.pdf');

  }
  onSearch(searchTerm: any) {
    // Check if the search term is invalid (implement your logic here)
    // For example, you can use a regex to check if the search term contains invalid characters

    if (searchTerm.includes('invalid')) {
      this.disableSelectAll = true;
    } else {
      this.disableSelectAll = false;
    }
  }

  onFilterChange(change) {

    let projects = [];
    if (change != undefined || null) {
      this.projectList.map((project) => {
        if (project?.project_name.toLowerCase().includes(change.toLowerCase())) {
          projects.push(project);
        }
      });

      if (projects.length == 0) {
        this.noData = true;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'project_id',
          textField: 'project_name',
          // textField: 'project_name',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          itemsShowLimit: 3,
          allowSearchFilter: true,
          noDataAvailablePlaceholderText: "No results matched your search!",
          allowRemoteDataSearch: true
        }

      } else {
        this.noData = false;
        this.dropdownSettings.allowRemoteDataSearch = true;

        this.dropdownSettings = {
          singleSelection: false,
          idField: 'project_id',
          textField: 'project_name',
          // textField: 'project_name',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          itemsShowLimit: 3,
          allowSearchFilter: true,
          noDataAvailablePlaceholderText: "No results matched your search!",
          allowRemoteDataSearch: false
        }
      }


    }
  }

  onFilterChangeUser(change) {

    let users = [];
    if (change != undefined || null) {
      this.usersList.map((user) => {
        if ((user.name).toLowerCase().includes(change.toLowerCase())) {
          users.push(user);
        }
      });

      if (users.length == 0) {
        this.noData = true;
        this.userdropdownSetting = {
          singleSelection: false,
          idField: 'user_id',
          textField: 'name',
          // textField: 'project_name',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          clearSearchFilter: false,
          itemsShowLimit: 3,
          allowSearchFilter: true,
          noDataAvailablePlaceholderText: "No results matched your search!",
          allowRemoteDataSearch: true
        }

      } else {
        this.noData = false;
        this.dropdownSettings.allowRemoteDataSearch = true;
        this.userdropdownSetting = {
          singleSelection: false,
          idField: 'user_id',
          textField: 'name',
          // textField: 'project_name',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          clearSearchFilter: false,
          itemsShowLimit: 3,
          allowSearchFilter: true,
          noDataAvailablePlaceholderText: "No results matched your search!",
          allowRemoteDataSearch: false
        }
      }


    }
  }



  private createDropdownSettings(idField: string, textField: string): IDropdownSettings {
    return {
      singleSelection: false,
      idField: idField,
      textField: textField,
      // textField: 'project_name',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
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
