<template>
  <header class="header">
    <button
      class="icon-button icon-button--menu"
      @click="toggleMenu"
    ></button>

    <slot name="actions" />
  </header>


  <Transition name="menu">
    <div v-if="isMenuOpen" class="overlay">

      <aside class="menu" @click.stop>

        <header class="menu-header">
          <button
            class="icon-button icon-button--menu"
            @click="closeMenu"
          ></button>
        </header>


        <div class="menu-content">
          <slot name="menu" />
        </div>


      </aside>

    </div>
  </Transition>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'


const isMenuOpen = ref(false)


const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}


const closeMenu = () => {
  isMenuOpen.value = false
}


const onKeyDown = (event) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}


onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})


onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>


<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 20px 20px 0 20px;
  background: white;
}


.icon-button--menu {
  background: url("@/assets/icons/icon-menu-20.svg") no-repeat center;
  background-size: contain;
}


.overlay {
  position: fixed;
  inset: 0;
  z-index: 30;

  display: flex;
  background: rgba(0, 0, 0, 0.2);
}


.menu {
  width: 260px;
  height: 100%;
  padding: 20px;

  background: white;
  border-right: 1px solid #E5E7EB;

  position: relative;
  z-index: 31;
}


.menu-header {
  margin-bottom: 20px;
  min-height: 44px;
}


.menu-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease;
}


.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}


.menu-enter-from .menu,
.menu-leave-to .menu {
  transform: translateX(-100%);
}


/* Layers
10 - sticky table header
20 - app header
30 - modal/menu overlay
31 - menu
*/
</style>
