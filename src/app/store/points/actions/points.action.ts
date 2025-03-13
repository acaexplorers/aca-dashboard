import { createAction, props } from "@ngrx/store";

export const loadPointsData = createAction(   // Acción para cargar los datos de puntos
  "[Points] Load Points Data",
  props<{ startDate: string; endDate: string }>()  
);
console.log("Disparando acción loadPointsData");

export const loadPointsDataSuccess = createAction(// Acción para cargar los datos de puntos
  "[Points] Load Points Data Success",
  props<{ globalReports: any[] }>()
);
console.log("Disparando acción loadPointsDataSuccess");

export const loadPointsDataFailure = createAction(// Acción para indicar que hubo un error al cargar los datos
  "[Points] Load Points Data Failure",
  props<{ error: any }>() 
);

export const generatePointsReport = createAction( // Acción para generar un reporte de puntos
  "[Points] Generate Points Report",
  props<{ startDate: string; endDate: string }>()
);

// Acción para indicar que el reporte se generó correctamente
export const generatePointsReportSuccess = createAction(
  "[Points] Generate Points Report Success",
  props<{ report: any }>()
);

export const loadWeeklyPoints = createAction(
  "[Reports] Load Weekly Reports",
  props<{ startDate: string; endDate: string; username: string }>()
);

export const loadWeeklyPointsSuccess = createAction(
  "[Reports] Load Weekly Reports",
  props<{ weeklyReports: any[] }>()
);

export const loadWeeklyPointsFailure = createAction(
  "[Reports] Load Weekly Reports",
  props<{ error: any }>()
);

