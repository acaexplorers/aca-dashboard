import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { ReportsService } from "app/services/reports.service";
import { StreaksService } from "app/services/streaks.service";
import { of, forkJoin } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import * as PointsActions from "app/store/points/actions/points.actions";

@Injectable()
export class PointsEffects {
  constructor(
    private actions$: Actions,
    private reportsService: ReportsService,
    private streaksService: StreaksService
  ) {}

  loadPointsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsActions.loadPointsData),
      mergeMap(({ startDate, endDate }) =>
        forkJoin({
          reports: this.reportsService.getUsersReports(startDate, endDate),
          streaks: this.streaksService.getStreaksData(startDate, endDate)
        }).pipe(
          map(({ reports, streaks }) =>
            PointsActions.loadPointsDataSuccess({ reports, streaks })
          ),
          catchError((error) =>
            of(PointsActions.loadPointsDataFailure({ 
              error: error.message || 'Failed to load points data' 
            }))
          )
        )
      )
    )
  );
}