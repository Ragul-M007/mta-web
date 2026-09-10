import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'mwl-demo-utils-calendar-header',
  template: `
    <div class="row text-center">
      <div class="col-md-4">
        <div>
          <div
           
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
            
          >
        
          <i class="fa fa-backward" aria-hidden="true"></i>
          </div>
          
          
        </div>
      </div>
      <div class="col-md-4">
        <h6>{{ viewDate | calendarDate: view + 'ViewTitle':locale }}</h6>
      </div>
       <div class="col-md-4">
         <div >
         <div
        
         mwlCalendarNextView
         [view]="view"
         [(viewDate)]="viewDate"
         (viewDateChange)="viewDateChange.next(viewDate)"
       >
       <i class="fa fa-forward" aria-hidden="true"></i>
       </div>
         </div>
       </div>
    </div>
    <br />
  `,
})
export class CalendarHeaderComponent {
  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;
}
