import { createSelector } from "@ngrx/store";

// Selector para obtener el estado de points
export const selectPointsState = (state: any) => state.points;

// Selector para obtener los datos de points
export const selectPointsData = createSelector(
  selectPointsState,
  (state) => state.data
);

// Selector para obtener el reporte generado
export const selectPointsReport = createSelector(
  selectPointsState,
  (state) => state.report
);