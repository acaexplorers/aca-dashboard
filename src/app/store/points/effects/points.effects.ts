import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { PointsService } from "app/services/points.service"; 
import * as PointsReportsActions from "app/store/points/actions/points.action";
@Injectable()
export class PointsEffects {
  constructor(
    private actions$: Actions, 
    private pointsService: PointsService // Asegúrate de que este servicio exista 
  ) {}
  
  loadPointsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsReportsActions.loadPointsData),
      tap(({ startDate, endDate }) => 
        console.log("Effect disparado - loadPointsData", startDate, endDate)),      
      mergeMap(({ startDate, endDate }) =>
        this.pointsService.getPointsData(startDate, endDate).pipe(
          tap((globalReports) => console.log("Datos recibidos:", globalReports)),
          map((globalReports) => PointsReportsActions.loadPointsDataSuccess({ globalReports })),
          catchError(
            (error) => of(PointsReportsActions.loadPointsDataFailure({ error }))
          )
        )
      )
    )
  );

  loadWeeklyPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsReportsActions.loadWeeklyPoints),
      mergeMap(({ startDate, endDate, username }) =>
        this.pointsService
          .getWeeklyPointsReports(startDate, endDate, username)
          .pipe(
            map((weeklyReports) =>
              PointsReportsActions.loadWeeklyPointsSuccess({ weeklyReports })
            ),
            catchError((error) =>
              of(PointsReportsActions.loadWeeklyPointsFailure({ error }))
            )
          )
      )
    )
  );

  
  
}
