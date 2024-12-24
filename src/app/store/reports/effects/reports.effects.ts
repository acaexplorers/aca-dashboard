import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { ReportsService } from "app/services/reports.service";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import * as ReportsActions from "app/store/reports/actions/reports.actions";

@Injectable()
export class ReportsEffects {
  constructor(
    private actions$: Actions,
    private reportsService: ReportsService
  ) {}

  loadGlobalReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsActions.loadGlobalReports),
      mergeMap(({ startDate, endDate }) =>
        this.reportsService.getUsersReports(startDate, endDate).pipe(
          map((globalReports) =>
            ReportsActions.loadGlobalReportsSuccess({ globalReports })
          ),
          catchError((error) =>
            of(ReportsActions.loadGlobalReportsFailure({ error }))
          )
        )
      )
    )
  );

  loadWeeklyReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsActions.loadWeeklyReports),
      mergeMap(({ startDate, endDate, username }) =>
        this.reportsService
          .getWeeklyUserReports(startDate, endDate, username)
          .pipe(
            map((weeklyReports) =>
              ReportsActions.loadWeeklyReportsSuccess({ weeklyReports })
            ),
            catchError((error) =>
              of(ReportsActions.loadWeeklyReportsFailure({ error }))
            )
          )
      )
    )
  );

  submitReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsActions.submitUserReport),
      mergeMap(({ report }) =>
        this.reportsService.sendReport(report).pipe(
          map(() => ReportsActions.submitUserReportSuccess({ report })),
          catchError((error) =>
            of(ReportsActions.submitUserReportFailure({ error }))
          )
        )
      )
    )
  );
}
