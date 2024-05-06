import type { TimeInDay } from "./time-in-day";

export interface DataShift {
  id?: number;
  date: any;
  shift: TimeInDay;
  idPerson: number;
  idType: number;
  nom?: string;
  email?: string;
  typeLabel?: string;
  subTypeLabel?: string;
  typeOfSchedule?: number;
  dateStart?: string;
  dateEnd?: string;
  message?: string | null;
  is_valid?: number;
}
