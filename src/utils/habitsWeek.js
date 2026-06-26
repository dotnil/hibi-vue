const isMetricSetForDateAndHabit = (metric, habitId, weekDate) =>{ 
  console.log(weekDate.toDateString())
  console.log(new Date(metric.date).toDateString())
  console.log(new Date(metric.date).toDateString() === weekDate.toDateString())

  console.log(habitId)
  console.log(metric.habit_id)

  // FIXME
  return metric.habit_id == habitId &&
  new Date(metric.date).toDateString() === weekDate.toDateString()
}

export const makeHabitsWeek = (habits, metrics, days) => {
  return habits.map(habit => ({
    ...habit,
    metrics: days.map(day => {
      // console.log(day)
      const found = metrics.find(m =>
        isMetricSetForDateAndHabit(m, habit.id, day)
      )

      return found ? found.value : false
    })
  }))
}
