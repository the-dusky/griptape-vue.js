<template>
  <div class="vk">

    <div class="vk__content vk__content--has-vk" v-if="current">
      <img src="../assets/key.svg" alt="key icon">
      <span>{{ bech32(current) }}</span>
      <a href="#" @click.prevent="forget">Forget</a>
    </div>

    <div class="vk__content" v-else-if="!current && !isFormShowing">
      <a href="#" @click.prevent="create">Create or get</a>
    </div>

    <div class="vk__content vk-form" v-else>
      <form @submit.prevent="add">

        <input type="text" v-model="form.vk"
          placeholder="Type or paste viewing key">

        <button>Add</button>
        <button type="button" @click.prevent="resetForm">Cancel</button>
      </form>
    </div>

  </div>
</template>

<script>
import { bech32 } from '@stakeordie/griptape.js'
import { mapState, mapActions } from 'pinia'
import { useViewingKeyStore } from '@/modules/viewing-keys'

export default {
  props: {
    contractAddress: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      form: {
        vk: ''
      },
      isFormShowing: false
    }
  },

  methods: {
    bech32,

    create() {
      this.createViewingKey(this.contractAddress)
      this.resetForm()
    },

    add() {
      if (!this.form.vk) return
      this.addViewingKey(this.contractAddress, this.form.vk)
      this.resetForm()
    },

    forget() {
      this.deleteViewingKey(this.contractAddress)
    },

    showForm() {
      this.isFormShowing = true
    },

    resetForm() {
      this.form.vk = ''
      this.isFormShowing = false
    },

    ...mapActions(useViewingKeyStore, [
      'createViewingKey',
      'deleteViewingKey',
      'getViewingKey'
    ])
  },

  computed: {
    ...mapState(useViewingKeyStore, [
      'viewingKeys'
    ]),

    current() {
      return this.getViewingKey(this.contractAddress)
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

  width: auto;
  padding: 0 var(--gutter);
  max-height: 100%;
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
