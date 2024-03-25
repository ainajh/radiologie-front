import dayjs from 'dayjs'

const isBeforeToday = (dateToCheck: any) => {
  const today = dayjs()

  return dateToCheck.isBefore(today, 'day')
}

export default isBeforeToday
