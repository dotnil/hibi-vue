import { getWeek, formatDate } from './utils/week'

const week = getWeek(new Date())

export const demoHabits = [
  {
    id: 1,
    name: 'Drink water',
  },
  {
    id: 2,
    name: 'Read 20 min',
  },
  {
    id: 3,
    name: 'Walk 30 min',
  },
  {
    id: 4,
    name: 'Meditate',
  },
]

export const demoMetrics = [
  // Drink water
  {
    habit_id: 1,
    date: formatDate(week.days[0]),
    value: true,
  },
  {
    habit_id: 1,
    date: formatDate(week.days[1]),
    value: true,
  },
  {
    habit_id: 1,
    date: formatDate(week.days[2]),
    value: true,
  },
  {
    habit_id: 1,
    date: formatDate(week.days[4]),
    value: true,
  },
  {
    habit_id: 1,
    date: formatDate(week.days[6]),
    value: true,
  },

  // Read 20 min
  {
    habit_id: 2,
    date: formatDate(week.days[1]),
    value: true,
  },
  {
    habit_id: 2,
    date: formatDate(week.days[3]),
    value: true,
  },
  {
    habit_id: 2,
    date: formatDate(week.days[5]),
    value: true,
  },

  // Walk 30 min
  {
    habit_id: 3,
    date: formatDate(week.days[2]),
    value: true,
  },
  {
    habit_id: 3,
    date: formatDate(week.days[6]),
    value: true,
  },

  // Meditate
  {
    habit_id: 4,
    date: formatDate(week.days[0]),
    value: true,
  },
  {
    habit_id: 4,
    date: formatDate(week.days[1]),
    value: true,
  },
  {
    habit_id: 4,
    date: formatDate(week.days[2]),
    value: true,
  },
  {
    habit_id: 4,
    date: formatDate(week.days[3]),
    value: true,
  },
  {
    habit_id: 4,
    date: formatDate(week.days[4]),
    value: true,
  },
]
