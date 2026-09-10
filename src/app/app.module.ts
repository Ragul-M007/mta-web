import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth/auth.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { ComponentsModule } from './components/components.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { HttpService } from './service/http.service';
import { AuthGuard } from './service/auth.guard'; 
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { PageContentComponent } from './layout/page-content/page-content.component';
import { AuthorisedLayoutComponent } from './layout/authorised/authorised-layout/authorised-layout.component';
import { AuthorisedSideNavComponent } from './layout/authorised/authorised-side-nav/authorised-side-nav.component';
import { AuthorisedSideNavTogglerComponent } from './layout/authorised/authorised-side-nav-toggler/authorised-side-nav-toggler.component';
import { AuthorisedTopNavComponent } from './layout/authorised/authorised-top-nav/authorised-top-nav.component';
import { HttpErrorInterceptor } from './service/http.middleware';
import { NgOtpInputModule } from  'ng-otp-input';
import { AccordianPageComponent } from './accordian/accordian-page/accordian-page.component';
import { DynamicInputComponent } from './dynamicForms/dynamic-input/dynamic-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { PrivacyPolicyDeleteComponent } from './auth/privacy-policy-delete/privacy-policy-delete.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../environments/environment';

function loadGoogleMaps(): () => Promise<void> {
  return () => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject('Google Maps failed to load');
    document.head.appendChild(script);
  });
}

// import {NgxDocViewerModule} from 'doc-viewer-angular/modules'

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SuperAdminComponent,
    LoginComponent,
    PageContentComponent,
    AuthorisedLayoutComponent,
    AuthorisedSideNavComponent,
    AuthorisedSideNavTogglerComponent,
    AuthorisedTopNavComponent,
    DynamicInputComponent,
    PrivacyPolicyDeleteComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ComponentsModule,
    NgxSpinnerModule,
    ImageCropperModule,
    NgxPaginationModule,
    NgOtpInputModule,
    BrowserAnimationsModule,
    MatTabsModule,
    GoogleMapsModule,
    // NgxDocViewerModule
  ],
 
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [HttpService, AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: loadGoogleMaps, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
