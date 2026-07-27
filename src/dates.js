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
    }),

    progress: calculateProgress(
      habit,
      metrics,
      getCalendarPeriod(habit.goal_period)
    )
  }))
}

export const getCalendarPeriod = (period, date = new Date()) => {
  const current = new Date(date)
  current.setHours(0, 0, 0, 0)

  if (period === 'day') {
    const end = new Date(current)
    end.setDate(current.getDate() + 1)

    return {
      startDate: formatDate(current),
      endDate: formatDate(end),
    }
  }

  if (period === 'week') {
    const day = current.getDay()

    const diff = day === 0 ? -6 : 1 - day

    const start = new Date(current)
    start.setDate(current.getDate() + diff)

    const end = new Date(start)
    end.setDate(start.getDate() + 7)

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    }
  }

  if (period === 'month') {
    const start = new Date(
      current.getFullYear(),
      current.getMonth(),
      1
    )

    const end = new Date(
      current.getFullYear(),
      current.getMonth() + 1,
      1
    )

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    }
  }
}

export const calculateProgress = (habit, metrics, period) => {
  const target = Number(habit.goal_target)

  const completed = metrics.filter(metric =>
    metric.habit_id === habit.id &&
    metric.value === true &&
    metric.date >= period.startDate &&
    metric.date < period.endDate
  ).length

  if (!target) {
    return 0
  }

  return Math.min(
    Math.round((completed / target) * 100),
    100
  )
}
