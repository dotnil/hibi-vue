import { ref, onMounted, onUnmounted } from 'vue'

export const DEFAULT_VISIBLE_DAYS = 7
export const MOBILE_VISIBLE_DAYS = 5
export const MOBILE_WIDTH = 500

export const useVisibleDays = () => {
  const visibleDays = ref(DEFAULT_VISIBLE_DAYS)

  const update = () => {
    visibleDays.value =
      window.innerWidth < MOBILE_WIDTH
        ? MOBILE_VISIBLE_DAYS
        : DEFAULT_VISIBLE_DAYS
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return visibleDays
}
