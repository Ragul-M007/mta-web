import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from '../login/login.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivacyPolicyDeleteComponent } from '../privacy-policy-delete/privacy-policy-delete.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: 'login/:type', component: LoginComponent
      },
      { path: 'privacy_policy', component: PrivacyPolicyComponent},
      { path: 'delete',component:PrivacyPolicyDeleteComponent}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AuthModule { }
