<template>
  <div class="loading" :class="{ 'loading--waiting': isLoading }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  --loading-icon-size: 36px;

  width: 100%;
  height: 100%;

  &--waiting {
    background-image: url(../assets/loading.gif);
    background-repeat: no-repeat;
    background-size: var(--loading-icon-size);
    background-position: center center;
  }
}
</style>
