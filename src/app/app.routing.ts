import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./views/login/login.component";
import { MatDialogModule } from "@angular/material/dialog";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "", // Root path
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },
  {
    path: "**", // Wildcard route for 404 (not found)
    redirectTo: "login", // Redirect unknown routes to the login page
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
    MatDialogModule,
  ],
  exports: [MatDialogModule],
})
export class AppRoutingModule {}
