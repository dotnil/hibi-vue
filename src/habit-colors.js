export const habitColors = [
  '#DDEA7C',
  '#A8F8E4',
  '#FFD0B5',
  '#DDC7FF',
]

export const getNextHabitColor = (lastColor) => {
  const lastIndex = habitColors.indexOf(lastColor)
  const nextIndex = (lastIndex + 1) % habitColors.length

  return habitColors[nextIndex]
}
