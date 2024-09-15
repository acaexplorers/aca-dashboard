import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',  // Define the login route
    component: LoginComponent
  },
  {
    path: '',  // Root path
    component: AdminLayoutComponent,  // Dashboard routes will be under this layout
    children: [
      {
        path: '',  // This will be the default route for AdminLayoutComponent
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  },
  {
    path: '**',  // Wildcard route for 404 (not found)
    redirectTo: 'login',  // Redirect unknown routes to the login page
  }
];


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
