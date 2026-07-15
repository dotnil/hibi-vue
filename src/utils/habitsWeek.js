const isMetricSetForDateAndHabit = (metric, habitId, weekDate) => {
  const metricDate = new Date(metric.date)

  return (
    metric.habit_id === habitId &&
    metricDate.toDateString() === weekDate.toDateString()
  )
}

export const makeHabitsWeek = (habits, metrics, days) => {
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
