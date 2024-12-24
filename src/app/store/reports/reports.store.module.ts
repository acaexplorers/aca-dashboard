import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { reportsReducer } from "./reducers/reports.reducer";
import { ReportsEffects } from "./effects/reports.effects";

@NgModule({
  imports: [
    StoreModule.forFeature("reports", reportsReducer),
    EffectsModule.forFeature([ReportsEffects]),
  ],
})
export class ReportsStoreModule {}
