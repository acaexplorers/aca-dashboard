import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./views/login/login.component";
import { MatIconModule } from "@angular/material/icon";
import { pointsReducer } from "./store/points/reducers/points.reducer"; // Asegúrate de que esta ruta sea correcta
import { PointsEffects } from "./store/points/effects/points.effects"; // Asegúrate de que esta ruta sea correcta

// NgRx Imports
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AuthStoreModule } from "app/store/auth/auth.store.module";
import { ReportsStoreModule } from "app/store/reports/reports.store.module";
import { environment } from "../environments/environment";
import { metaReducers } from "./store/meta-reducers";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatIconModule,
    StoreModule.forRoot({ points: pointsReducer }), // Configura el reducer
    EffectsModule.forRoot([PointsEffects]), // Configura los efectos
    StoreModule.forRoot({}, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production,
    }),
    AuthStoreModule,
    ReportsStoreModule,
  ],
  declarations: [AppComponent, AdminLayoutComponent, LoginComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
