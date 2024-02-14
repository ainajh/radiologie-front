import type { TimeInDay } from './time-in-day'

export interface DataShift {
  id?: number ,
  date: any ,
  shift: TimeInDay,
  idPerson: number,
  idType: number,
  nom?: String,
  email?: String,
  typeLabel?: String,
  subTypeLabel?: String
}
