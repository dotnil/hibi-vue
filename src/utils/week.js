export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getWeek = (date) => {
  const today = new Date(date)
  today.setHours(0, 0, 0, 0)

  const start = new Date(today)
  start.setDate(today.getDate() - 6)

  const end = new Date(today)
  end.setDate(today.getDate() + 1)

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start)
    day.setDate(start.getDate() + i)

    return day
  })

  return {
    weekStart: start,
    days,
    startDate: formatDate(start),
    endDate: formatDate(end),
  }
}
