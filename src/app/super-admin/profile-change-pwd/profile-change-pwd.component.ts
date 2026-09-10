import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-change-pwd',
  templateUrl: './profile-change-pwd.component.html',
  styleUrls: ['./profile-change-pwd.component.scss']
})
export class ProfileChangePwdComponent implements OnInit {
  flag: any;
  showPassword = false;
  showProfile = false;

  constructor(
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
  }

}
