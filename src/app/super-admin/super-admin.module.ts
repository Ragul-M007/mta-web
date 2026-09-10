import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuperAdminComponent } from './super-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { CategoryComponent } from './category/category.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ProfileChangePwdComponent } from './profile-change-pwd/profile-change-pwd.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppModule } from '../app.module';
import { AccordianPageComponent } from '../accordian/accordian-page/accordian-page.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT,
} from 'angular-calendar';
import { DemoUtilsModule } from './utils/module';
import moment from 'moment';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { CommentsComponent } from './comments/comments.component';
import { NotificationComponent } from './notification/notification.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrdersComponent } from './orders/orders.component';
import { TeamsComponent } from './teams/teams.component';
import { PaginationComponent } from '../pagination/pagination/pagination.component';
import { ProjectCommentsComponent } from './project-comments/project-comments.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SafePipe } from '../pipe/safe.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { GooglemapsComponent } from './googlemaps/googlemaps.component';

// import {NgxDocViewerModule} from 'ng'
export function momentAdapterFactory() {
  return adapterFactory(moment);
}
const routes: Routes = [
  {
    path: '',
    component: SuperAdminComponent,
    children: [
      { path: 'project', component: DashboardComponent, data: { viewOption: 'projectPage' } },
      { path: 'projectsview', component: DashboardComponent, data: { viewOption: 'projectgetById' } },
      { path: 'products', component: AttendanceComponent },
      { path: 'categoriesView', component: CategoryComponent },
      { path: 'viewUser', component: ViewUserComponent },
      { path: 'attendanceView', component: AttendanceComponent },
      { path: 'viewproject', component: ProjectDetailsComponent },
      { path: 'user', component: UserComponent },
      { path: 'userBack', component: UserComponent,data:{viewOption:'revisit'} },
      { path: 'profileEdit', component: ProfileChangePwdComponent },
      { path: 'userdetails', component: UserDetailsComponent },
      { path: 'newsfeed', component: NewsfeedComponent },
      { path: 'comments', component: CommentsComponent },
      { path: 'notifications', component: NotificationComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'dashboard', component: TeamsComponent },
      {path:'project-comments',component:ProjectCommentsComponent},
      {path:'attendance-report',component:AttendanceReportComponent },
      {path:'gmaps',component:GooglemapsComponent }

    ]
  }
];

@NgModule({
  declarations: [DashboardComponent,
    ProjectDetailsComponent,
    AccordianPageComponent,
    UserDetailsComponent,
    AttendanceComponent, ProfileComponent, NewsfeedComponent, CommentsComponent, NotificationComponent,
    SettingsComponent, CategoryComponent, ViewUserComponent, UserComponent, ProfileChangePwdComponent, OrdersComponent,
    TeamsComponent, PaginationComponent, ProjectCommentsComponent, AttendanceReportComponent,SafePipe, GooglemapsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgxPaginationModule,
    NgxQRCodeModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SearchPipeModule,
    HttpClientModule,
   
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      }
    ),
    DemoUtilsModule,
    NgxDocViewerModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatTabsModule,
    NgxSpinnerModule,
  ],
  exports: [
    AccordianPageComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
  ],
})
export class SuperAdminModule { }
