import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './service/auth.guard';
import { AuthorisedLayoutComponent } from './layout/authorised/authorised-layout/authorised-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth/auth.module').then(m => m.AuthModule) },
  // {
  //   path: '',
  //   component: AuthorisedLayoutComponent,
  //   children: [
      {
        path: 'admin', loadChildren: () => import('./super-admin/super-admin.module').then(admin => admin.SuperAdminModule),
        canActivate: [AuthGuard],
        // data: {
        //   expectedRole: [CommonServicesService.ROLES.SUPERADMIN]
        // }
      },
    
    // ]
  // },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
