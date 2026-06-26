export const getWeekDays = (date) => {
  const monday = new Date(date)
  const dayOfWeek = monday.getDay()
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  monday.setDate(monday.getDate() + offset)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}
