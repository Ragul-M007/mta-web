import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  currentYear = new Date().getFullYear();

  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/auth/login']);
  }

  ngOnInit(): void {
  }

}
