import type { TimeInDay } from './time-in-day'

/**
 *
 * Object should have
 *
 * name :string
 * date DateTime : string
 * shift  enum< morning | afternoon > :TimeInDay
 *
 */
export interface DataShift {
  name: string
  date: any
  shift: TimeInDay
  block: string
}
