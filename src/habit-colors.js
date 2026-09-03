export const habitColors = [
  '#DDEA7C',
  '#A8F8E4',
  '#FFD0B5',
  '#DDC7FF',
]

export const getRandomHabitColor = () => {
  const index = Math.floor(Math.random() * habitColors.length)

  return habitColors[index]
}
