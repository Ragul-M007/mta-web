import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { HttpService } from '../../../service/http.service';

@Component({
  selector: 'app-authorised-top-nav',
  templateUrl: './authorised-top-nav.component.html',
  styleUrls: ['./authorised-top-nav.component.scss']
})
export class AuthorisedTopNavComponent implements OnInit {
  userdetails: any;

  constructor(
    public dataService: DataService,
    public http: HttpService
  ) { }

  ngOnInit(): void {

    this.userdetails = this.dataService.getData("userData");
    console.log("item", this.userdetails);
    
  }

}
