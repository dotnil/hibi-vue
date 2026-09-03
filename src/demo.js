import { getLastDays, formatDate } from './dates'

const period = getLastDays(new Date())

export const demoHabits = [
  {
    id: 1,
    name: 'Drink protein',
    color: '#DDEA7C',
    goal_period: 'week',
    goal_target: 4,
  },
  {
    id: 2,
    name: 'Read 20 min',
    color: '#A8F8E4',
    goal_period: 'week',
    goal_target: 5,
  },
  {
    id: 3,
    name: 'Walk 30 min',
    color: '#FFD0B5',
    goal_period: 'week',
    goal_target: 7,
  },
  {
    id: 4,
    name: 'Meditate',
    color: '#DDC7FF',
    goal_period: 'day',
    goal_target: 1,
  },
]

export const demoMetrics = [
  // Drink water
  {
    habit_id: 1,
    date: formatDate(period.days[0]),
    value: true,
  },
  {
    habit_id: 1,
    date: formatDate(period.days[1]),
    value: true,
  },
  {
    habit_id: 1,
    date: formatDate(period.days[2]),
    value: true,
  },
  {
    habit_id: 1,
    date: formatDate(period.days[4]),
    value: true,
  },
  {
    habit_id: 1,
    date: formatDate(period.days[6]),
    value: true,
  },

  // Read 20 min
  {
    habit_id: 2,
    date: formatDate(period.days[1]),
    value: true,
  },
  {
    habit_id: 2,
    date: formatDate(period.days[3]),
    value: true,
  },
  {
    habit_id: 2,
    date: formatDate(period.days[5]),
    value: true,
  },

  // Walk 30 min
  {
    habit_id: 3,
    date: formatDate(period.days[2]),
    value: true,
  },
  {
    habit_id: 3,
    date: formatDate(period.days[6]),
    value: true,
  },

  // Meditate
  {
    habit_id: 4,
    date: formatDate(period.days[0]),
    value: true,
  },
  {
    habit_id: 4,
    date: formatDate(period.days[1]),
    value: true,
  },
  {
    habit_id: 4,
    date: formatDate(period.days[2]),
    value: true,
  },
  {
    habit_id: 4,
    date: formatDate(period.days[3]),
    value: true,
  },
  {
    habit_id: 4,
    date: formatDate(period.days[6]),
    value: true,
  },
]
