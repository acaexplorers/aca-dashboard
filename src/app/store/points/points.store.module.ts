import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { pointsReducer } from "./reducers/points.reducer";
import { PointsEffects } from "./effects/points.effects";

@NgModule({
  imports: [
    StoreModule.forFeature("points", pointsReducer),
    EffectsModule.forFeature([PointsEffects]),
  ],
})
export class PointsStoreModule {}