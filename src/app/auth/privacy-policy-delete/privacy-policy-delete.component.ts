import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy-delete',
  templateUrl: './privacy-policy-delete.component.html',
  styleUrls: ['./privacy-policy-delete.component.scss']
})
export class PrivacyPolicyDeleteComponent implements OnInit {

  currentYear = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
