import dayjs from 'dayjs'

const getMonth = (month = dayjs().month()) => {
  const year = dayjs().year()

  const firstDayOfMonth = dayjs(new Date(year, month, 1))

  const offsetToMonday = (firstDayOfMonth.day() - 1 + 7) % 7

  const firstMondayOfMonth = firstDayOfMonth.subtract(offsetToMonday, 'day')

  let currentMonthCount = 0

  const dayMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++
      return firstMondayOfMonth.add(currentMonthCount - 1, 'day')
    })
  })

  return dayMatrix
}

export default getMonth

/**
 *
 * Old version
 */

// import dayjs from 'dayjs'

// const getMonth = (month = dayjs().month()) => {
//   const year = dayjs().year()
//   const firstDayOfMonth = dayjs(new Date(year, month, 1)).day()

//   let currentMonthCount = 0 - firstDayOfMonth

//   const dayMatrix = new Array(5).fill([]).map(() => {
//     return new Array(7).fill(null).map(() => {
//       currentMonthCount++
//       return dayjs(new Date(year, month, currentMonthCount))
//     })
//   })
//   return dayMatrix
// }

// export default getMonth
