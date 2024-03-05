import dayjs from 'dayjs'

const isMemberOfCurrentMonth = (monthIndex: any, dateToCheck: any) => {
  const year = dayjs().year()
  const firstDayOfMonth = dayjs(new Date(year, monthIndex, 1))
  const endDayOfMonth = firstDayOfMonth.endOf('month')

  return dateToCheck.isBefore(firstDayOfMonth) || dateToCheck.isAfter(endDayOfMonth)
}

export default isMemberOfCurrentMonth
