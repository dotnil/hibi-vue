export const habitColors = [
  '#DDEA7C',
  '#A8F8E4',
  '#FFD0B5',
  '#DDC7FF',
  '#f8c8dc',
  '#f9e79f',
  '#fffbe2',
  '#d8cff0',
  '#bfb8b2',
]

export const getNextHabitColor = (lastColor) => {
  const lastIndex = habitColors.indexOf(lastColor)
  const nextIndex = (lastIndex + 1) % habitColors.length

  return habitColors[nextIndex]
}
