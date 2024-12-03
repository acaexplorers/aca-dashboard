import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "app/views/dashboard/dashboard.component";
import { UserProfileComponent } from "app/views/user-profile/user-profile.component";
import { TableListComponent } from "app/views/table-list/table-list.component";
import { TypographyComponent } from "app/views/typography/typography.component";

//Real routes
import { ClanCouncilFormComponent } from "app/views/clan-council-form/clan-council-form.component";
import { RunaFormComponent } from "app/views/runa-form/runa-form.component";
import { RegisterActivityComponent } from "app/views/register-activity/register-activity.component";
import { StatsComponent } from "app/views/stats/stats.component";
import { PointsComponent } from "app/views/points/points.component";

//Sub components
import { QuestionnaireComponent } from "app/views/questionnaire/questionnaire.component";

import { IconsComponent } from "app/views/icons/icons.component";
import { MapsComponent } from "app/views/maps/maps.component";
import { NotificationsComponent } from "app/views/notifications/notifications.component";
import { UpgradeComponent } from "app/views/upgrade/upgrade.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";

import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";

import { MatTableModule } from "@angular/material/table";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatExpansionModule } from "@angular/material/expansion";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,

    //New modules form forms
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,

    MatTableModule,
    MatButtonToggleModule,
    MatExpansionModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,

    // Real routes
    ClanCouncilFormComponent,
    RunaFormComponent,
    QuestionnaireComponent,
    RegisterActivityComponent,
    StatsComponent,
    PointsComponent,
  ],
})
export class AdminLayoutModule {}
