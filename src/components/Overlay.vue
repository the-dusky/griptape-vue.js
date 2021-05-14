<template>
  <div class="overlay" v-show="show"></div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
}
</script>

<style lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);

  z-index: var(--z-index-01);
}
</style>
