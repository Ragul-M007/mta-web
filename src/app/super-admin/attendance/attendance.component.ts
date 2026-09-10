import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ExcelServicesService } from '../../service/excel-services.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { isEqual, isObject, difference, transform } from 'lodash';
import {
  CalendarEvent,
  CalendarView,
  DAYS_OF_WEEK,
  CalendarDateFormatter,
  DateFormatterParams,
} from 'angular-calendar';
import  moment from 'moment';
import { CustomDateFormatter } from '../utils/custom-date-formatter.provider';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';
moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.SUNDAY,
    doy: 0,
  },
});

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class AttendanceComponent implements OnInit {
  staffList: any = [];
  contractorList: any = [];
  AdminList: any = [];
  selectedDate: any;
  checkINData: any = {};
  checkOUTData: any = {};
  selectDate: any;
  user_id: any;
  user: any;
  activeState: any = {};
  attendanceList: any = [];
  docUrl: any;
  excel = [];
  excel2 = [];
  monthSelect: any;
  excelMonth = [];
  selectDate2: any;
  selectDate3: any;
  selectDate4: any;
  dateResult: any;
  excelMonth2: [];
  displayMonth: string;
  userPerdate: boolean = false;
  userMonth: boolean = false;
  datemonthexcel: boolean = false;
  excelMonthTotal: boolean = false;
  searchText: any;
  constructor(
    public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private excelService: ExcelServicesService,
    private router: Router
  ) { }

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
  ngOnInit(): void {
    this.getUsers();
    this.selectDate = moment(this.viewDate).format('DD-MMMM-YYYY');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateAttendance();
      }
    });
    this.http
      .getMethod('users/updateusercounts')
      .then((response: any) => {
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateAttendance() {
    this.http
      .getMethod('attendance/updateattendancecounts')
      .then((response: any) => {
        // this.attendanceListCheck();
      });
  }

  getUsers() {
    this.staffList = [];
    this.contractorList = [];
    this.AdminList = [];
    this.http
      .getMethod('users')
      .then((response: any) => { //User List Based on Role ID
        let res = response.data;
        for (var i = 0; i < res.length; i++) {
          if (res[i].role_id == 2) {
            this.staffList.push(res[i]);
          } else if (res[i].role_id == 5) {
            this.contractorList.push(res[i]);
          } else if (res[i].role_id == 1) {
            this.AdminList.push(res[i]);
          }
        }
        this.user = this.staffList[0];
        this.activeState = this.user;
        this.monthClicked(this.viewDate);
        this.dayClicked(this.selectDate);

      })
      .catch((err) => {
        console.log(err);
      });
  }

  dayClicked(day) {
    this.selectedDate = moment(day.date).format('D MMM, ddd');
    this.selectDate = moment(day.date).format('DD-MM-YYYY');
    this.selectDate2 = moment(day.date).format('DD-MM-YYYY');

    // this.selectDate = this.user.name + ' ' + this.selectDate;
    this.fetchuserparticularDateAttendance(this.user); //user current date report(oneday)
    this.fetchuserMonthlyAttendance(this.user); //user monthly report(month)
    this.fetchSelectedDateAllusersAttendance(this.selectDate); //particular date overall users report(oneday)

    var da = this.selectDate.split('-');
    if (da.length == 3) {
      return (this.selectDate3 = this.user.name + ' ' + da[1] + '-' + da[2]);
    }else{
      return null;
    }
  }

  dayClicked2(day) {
    this.selectedDate = moment(day.date).format('D MMM, ddd');
    this.selectDate = moment(day.date).format('DD-MM-YYYY');
    this.selectDate2 = moment(day.date).format('DD-MM-YYYY');

    this.fetchuserparticularDateAttendance(this.user); //user current date report(oneday)
    this.fetchSelectedDateAllusersAttendance(this.selectDate); //particular date overall users report(oneay)
    this.dateResult = this.user.name + ' ' + this.selectDate;

    var da = this.selectDate.split('-');
    if (da.length == 3) {
      this.selectDate3 = this.user.name + ' ' + da[1] + '-' + da[2];
      this.selectDate4 = da[0] + '-' + da[1] + '-' + da[2];
      this.displayMonth = da[1] + '-' + da[2];
    }
  }

  monthClicked(month : any) {
    this.monthSelect = moment(month).format('DD-MM-YYYY');
    this.selectDate2 = moment(month).format('DD-MM-YYYY');
    this.selectDate4 = moment(month).format('DD-MM-YYYY');
    this.dateResult = this.user.name + ' ' + this.monthSelect;
    var da = this.monthSelect.split('-');

    if (da.length == 3) {
      this.monthSelect = da[1] + '-' + da[2];
      this.displayMonth = da[1] + '-' + da[2];
    }

    this.fetchallUsersMonthAttendance(month); //all user overall month report

    var da = this.monthSelect.split('-');
    if (da.length == 2) {
      return (this.selectDate3 = this.user.name + ' ' + da[0] + '-' + da[1]);
    }
    else{
      return null
    }

    // var month = this.monthSelect.split('-');

    // if (month.length == 3) {
    //   this.selectDate3 = item.name + ' ' + month[1] + '-' + month[2];
    // } else {
    //   this.selectDate3 = item.name + ' ' + this.monthSelect;
    // }
  }

  //all user monthly report 
  fetchallUsersMonthAttendance(item) {
    // var da = this.monthSelect.split('-');

    // if (da.length == 3) {
    //   return (this.monthSelect = da[1] + '-' + da[2]);
    // }
    // this.monthSelect = item;

    if (item.length != undefined) {
      this.monthSelect = item;
    }

    this.http
      .getMethod('attendance/?date=' + this.monthSelect)
      .then((response: any) => {
        this.attendanceList = response.data;
        this.attendanceList = this.attendanceList?.map((item) => {
          delete item.user_id; //Need Clarification
          delete item.updated_at;
          delete item.id;
          delete item.created_at;
          delete item.latLng;
          return (this.attendanceList = item);
        });

        this.excelMonth = this.attendanceList;
        if (this.attendanceList == undefined) {
          this.attendanceList = null;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //particular date overall users report(oneday)
  fetchSelectedDateAllusersAttendance(item) {
    if (item.length != undefined) {
      this.monthSelect = item;
    }

    this.http
      .getMethod('attendance/?date=' + this.monthSelect)
      .then((response: any) => {
        this.attendanceList = response.data;
        this.attendanceList = this.attendanceList?.map((item) => {
          delete item.user_id;
          delete item.updated_at;
          delete item.id;
          delete item.created_at;
          delete item.latLng;
          return (this.attendanceList = item);
        });

        this.excelMonth2 = this.attendanceList;

        if (this.attendanceList == undefined) {
          this.attendanceList = null;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //user current date report(oneday)
  fetchuserparticularDateAttendance(item) {
    this.activeState = item;
    this.user_id = item.user_id;
    this.user = item;
    this.http
      .getMethod(
        'attendance?user_id=' +
        parseInt(this.user_id) +
        '&&date=' +
        this.selectDate
      )
      .then((response: any) => {
        let res = response.data;
        this.attendanceList = res;

        this.excel = this.attendanceList;

        if (this.attendanceList == undefined) {
          this.attendanceList = null;
        }
        // if(res.length){
        //   for(var i=0; i < res.length;i++){
        //     if(res[i].checkType =="IN"){
        //       this.checkINData=res[i];
        //     }else{
        //       this.checkOUTData=res[i];
        //     }
        //   }
        // }else{
        //   this.checkINData={};
        //   this.checkOUTData={};
        // }
      })
      .catch((err) => {
        console.log(err);
      });
    this.fetchAllAttendance(item);
  }

  //user monthly report(month)
  fetchuserMonthlyAttendance(item) {
    this.activeState = item;
    var month = this.monthSelect.split('-');

    if (month.length == 3) {
      this.monthSelect = month[1] + '-' + month[2];
      this.selectDate3 = item.name + ' ' + month[1] + '-' + month[2];
    } else {
      this.selectDate3 = item.name + ' ' + this.monthSelect;
    }

    this.dateResult = item.name + ' ' + this.selectDate2;

    this.user = item;

    var da = this.selectDate.split('-');
    this.user_id = item.user_id;
    this.user = item;
    this.http
      .getMethod(
        'attendance?user_id=' +
        parseInt(this.user_id) +
        '&&date=' +
        this.monthSelect
      )
      .then((response: any) => {
        let res = response.data;
        this.attendanceList = res;

        this.attendanceList = this.attendanceList?.map((item) => {
          delete item.user_id;
          delete item.updated_at;
          delete item.id;
          delete item.created_at;
          delete item.latLng;
          return (this.attendanceList = item);
        });

        this.excel2 = this.attendanceList;

        if (this.attendanceList == undefined) {
          this.attendanceList = null;
        }
        // if(res.length){
        //   for(var i=0; i < res.length;i++){
        //     if(res[i].checkType =="IN"){
        //       this.checkINData=res[i];
        //     }else{
        //       this.checkOUTData=res[i];
        //     }
        //   }
        // }else{
        //   this.checkINData={};
        //   this.checkOUTData={};
        // }
      })
      .catch((err) => {
        console.log(err);
      });
    this.fetchAllAttendance(item);
    this.fetchuserparticularDateAttendance(this.user); //user current date report(oneday)
    this.user = item;
  }

  exportAsXLSX(): void {
    // this.excelService.exportAsExcelFile(this.excel, 'Attendence Detatils');

    this.userPerdate = true;
    this.userMonth = false;
    this.datemonthexcel = false;
    this.excelMonthTotal = false;
  }

  downloadUserDailyReport() {
    this.excelService.exportAsExcelFile(this.excel, 'Attendence Detatils');
  }

  exportAsXLSX2(): void {

    this.userPerdate = false;
    this.userMonth = true;
    this.datemonthexcel = false;
    this.excelMonthTotal = false;
  }

  downloadUserMonthReport() {
    this.excelService.exportAsExcelFile(this.excel2, 'Attendence Detatils');
  }

  exportAsMonthXLSX(): void {

    // this.excelService.exportAsExcelFile(this.excelMonth, 'Attendence Detatils');

    this.userPerdate = false;
    this.userMonth = false;
    this.datemonthexcel = false;
    this.excelMonthTotal = true;
  }

  allUserMonthReport() {
    this.excelService.exportAsExcelFile(this.excelMonth, 'Attendence Detatils');
  }

  exportAsMonthXLSX2(): void {

    // this.excelService.exportAsExcelFile(this.excelMonth2,'Attendence Detatils');

    this.userPerdate = false;
    this.userMonth = false;
    this.datemonthexcel = true;
    this.excelMonthTotal = false;
  }

  allUserDailyReport() {
    this.excelService.exportAsExcelFile(
      this.excelMonth2,
      'Attendence Detatils'
    );
  }

  fetchAllAttendance(item) {
    this.activeState = item;
    this.user_id = item.user_id;
    this.user = item;
    this.http
      .getMethod('attendance/?date=' + this.selectDate)
      .then((response: any) => {
        let res = response.data;
        this.docUrl = res?.docUrl;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  changeUsertab() {
    this.searchText = '';
    this.userPerdate = false
    this.userMonth = false;
    this.excelMonthTotal = false;
    this.datemonthexcel = false;
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
