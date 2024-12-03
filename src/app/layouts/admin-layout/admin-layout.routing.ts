import { Routes } from "@angular/router";

import { DashboardComponent } from "app/views/dashboard/dashboard.component";
import { UserProfileComponent } from "app/views/user-profile/user-profile.component";
import { ClanCouncilFormComponent } from "app/views/clan-council-form/clan-council-form.component";
import { RunaFormComponent } from "app/views/runa-form/runa-form.component";
import { RegisterActivityComponent } from "app/views/register-activity/register-activity.component";
import { StatsComponent } from "app/views/stats/stats.component";
import { PointsComponent } from "app/views/points/points.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "stats", component: StatsComponent },
  { path: "clan-council-form", component: ClanCouncilFormComponent },
  { path: "runa-form", component: RunaFormComponent },
  { path: "register-activity", component: RegisterActivityComponent },
  { path: "points", component: PointsComponent },
];
