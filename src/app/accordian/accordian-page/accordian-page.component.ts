import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accordian-page',
  templateUrl: './accordian-page.component.html',
  styleUrls: ['./accordian-page.component.scss']
})
export class AccordianPageComponent implements OnInit {

  @Input("data") data: any;

  constructor() { 
  }

  ngOnInit() {
  }

}
