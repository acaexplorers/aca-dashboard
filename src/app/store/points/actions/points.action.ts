import { createAction, props } from "@ngrx/store";

// Acción para indicar que hubo un error al cargar los datos
export const loadPointsDataFailure = createAction(
  "[Points] Load Points Data Failure",
  props<{ error: any }>()
);
// Acción para cargar los datos de puntos
export const loadPointsData = createAction(
  "[Points] Load Points Data",
  props<{ startDate: string; endDate: string }>()
);

// Acción para indicar que los datos se cargaron correctamente
export const loadPointsDataSuccess = createAction(
  "[Points] Load Points Data Success",
  props<{ data: any }>()
);

// Acción para generar un reporte de puntos
export const generatePointsReport = createAction(
  "[Points] Generate Points Report",
  props<{ startDate: string; endDate: string }>()
);

// Acción para indicar que el reporte se generó correctamente
export const generatePointsReportSuccess = createAction(
  "[Points] Generate Points Report Success",
  props<{ report: any }>()
);