import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { PointsService } from "app/services/points.service"; // Asegúrate de que este servicio exista
import { loadPointsData, loadPointsDataSuccess, loadPointsDataFailure } from "app/store/points/actions/points.action";

@Injectable()
export class PointsEffects {
  constructor(private actions$: Actions, private pointsService: PointsService) {}

  loadPointsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPointsData),
      mergeMap(({ startDate, endDate }) =>
        this.pointsService.getPointsData(startDate, endDate).pipe(
          map((data) => loadPointsDataSuccess({ data })),
          catchError((error) => of(loadPointsDataFailure({ error })))
        )
      )
    )
  );
}