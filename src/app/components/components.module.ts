import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// imports
import { MatIconModule } from '@angular/material/icon';
// Custom components
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WeekSelectorComponent } from './weekSelector/week-selector.component';

//Custom components
import { DialogComponent } from './dialog/dialog.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DialogComponent,
    WeekSelectorComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    WeekSelectorComponent
  ]
})
export class ComponentsModule { }
