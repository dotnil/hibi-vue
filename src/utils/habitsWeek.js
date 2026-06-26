const isMetricSetForDateAndHabit = (metric, habitId, weekDate) =>
  metric.habit_id === habitId &&
  new Date(metric.date).toDateString() ===
  weekDate.toDateString();

export const makeHabitsWeek = (habits, metrics, days) => {
  return habits.map(habit => ({
    ...habit,
    metrics: days.map(day => {
      const found = metrics.find(m =>
        isMetricSetForDateAndHabit(m, habit.id, day)
      )

      return found ? found.value : false
    })
  }))
}
