import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ReportsPoints } from "./points.state";

// Selector para obtener el estado de points
export const selectPointsState =  createFeatureSelector<ReportsPoints>('reports');

// Selector para obtener los datos de points
export const selectPointsData = createSelector(
  selectPointsState,
  (state) => state?.globalReports ?? [] // Usa `?? []` para evitar `undefined`
);


// Selector para obtener el reporte generado
export const selectGlobalPointsReportsError = createSelector(
  selectPointsState,
  (state) => state.errorGlobal
);