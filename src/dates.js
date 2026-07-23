export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getLastDays = (date) => {
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

const isMetricSetForDateAndHabit = (metric, habitId, weekDate) => {
  const metricDate = new Date(metric.date)

  return (
    metric.habit_id === habitId &&
    metricDate.toDateString() === weekDate.toDateString()
  )
}

export const makeHabitsDays = (habits, metrics, days) => {
  return habits.map(habit => ({
    ...habit,
    metrics: days.map(day => {
      const foundMetric = metrics.find(metric =>
        isMetricSetForDateAndHabit(metric, habit.id, day)
      )

      return foundMetric ? foundMetric.value : false
    })
  }))
}
