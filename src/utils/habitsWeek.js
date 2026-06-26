import { formatDate } from './week.js'

const sameMetric = (metric, habitId, date) =>
  metric.habit_id === habitId &&
  metric.date === formatDate(date)

export const makeHabitsWeek = (habits, metrics, days) => {
  return habits.map(habit => ({
    ...habit,
    metrics: days.map(day => {
      const found = metrics.find(m =>
        sameMetric(m, habit.id, day)
      )

      return found ? found.value : false
    })
  }))
}
