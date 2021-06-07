<template>
  <div class="vk">

    <!-- User current viewing key -->
    <div class="vk__content vk__content--has-vk" v-if="hasViewingkeys">
      <img src="../assets/key.svg" alt="key icon">
      <span>{{ viewingKeys.current }}</span>
      <a href="#" @click.prevent="forgetViewingKey">Forget</a>
    </div>

    <!-- For adding or creating a new viewing key -->
    <div class="vk__content" v-else-if="!isFormShowing">
      <span>
        <a href="#" @click.prevent="createViewingKey">Create</a>
        or
        <a href="#" @click.prevent="showForm">Add</a>
        a viewing key
      </span>
    </div>

    <!-- TODO This is another component, moving forward for now. -->
    <div class="vk__content vk-form" v-if="isFormShowing">
      <form @submit.prevent="setViewingKey">
        <input type="text" v-model="vk" placeholder="Type or paste viewing key">
        <button>Add</button>
        <button type="button" @click="resetForm">Cancel</button>
      </form>
    </div>

  </div>
</template>

<script>
import { ViewingKeysState, ViewingKeysActions } from '../modules/viewing-keys';

export default {
  data() {
    return {
      isFormShowing: false,

      // vk-form data
      vk: ''
    }
  },

  computed: {
    ...ViewingKeysState
  },

  methods: {
    ...ViewingKeysActions,

    showForm() {
      this.isFormShowing = true;
    },

    resetForm() {
      this.vk = '';
      this.isFormShowing = false;
    },

    setViewingKey() {
      if (!this.vk) {
        return;
      }
      this.putViewingKey(this.vk);
      this.isFormShowing = false;
    },

    forgetViewingKey() {
      this.deleteViewingKey();
      this.resetForm();
    }
  }
}
</script>

<style lang="scss" scoped>
.vk {
  --vk-width: 254px;
  --vk-height: 46px;
  --vk-border: 1px solid black;
  --vk-border-radius: 4px;

  width: 100%;
  max-height: 100%;
  max-width: var(--vk-width);
  height: var(--vk-height);
  border: var(--vk-border);
  border-radius: var(--vk-border-radius);

  &__content {
    width: 100%;
    height: 100%;

    display: grid;
    grid-auto-flow: column;
    grid-column-gap: var(--gutter);
    place-items: center center;

    &--has-vk {
      padding: 0 var(--gutter-l);

      img {
        justify-self: end;
      }

      span {
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        justify-self: start;
      }
    }
  }
}

.vk-form {
  form {
    display: grid;
    grid-auto-flow: column;
  }
}
</style>
