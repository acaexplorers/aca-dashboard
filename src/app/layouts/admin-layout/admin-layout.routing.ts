import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { ClanCouncilFormComponent } from "app/clan-council-form/clan-council-form.component";
import { RunaFormComponent } from "app/runa-form/runa-form.component";
import { RegisterActivityComponent } from "app/register-activity/register-activity.component";
import { StatsComponent } from "app/stats/stats.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "stats", component: StatsComponent },
  { path: "clan-council-form", component: ClanCouncilFormComponent },
  { path: "runa-form", component: RunaFormComponent },
  { path: "register-activity", component: RegisterActivityComponent },
];
