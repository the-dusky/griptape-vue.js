<template>
  <!-- TODO: #81 Notify user if viewing key exists, but it isn't working (another one has been created elsewhere) @the-dusky -->
  <div class="vkeys">

    <a href="#" @click.prevent="showModal = !showModal">
      <img v-if="!imgSrc" class="vkeys__wallet-icon" :class="{ enabled: savedViewingKey != null }" src="../../assets/key-icon.png" alt="key icon">
      <img v-else class="vkeys__wallet-icon" :class="{ enabled: savedViewingKey != null }" :src="srcImg" alt="key icon">
    </a>

    <overlay :show="showModal"></overlay>

    <div class="modal" v-show="showModal" :class="alignClasses">
      <div class="modal__content">

        <h3>Viewing keys</h3>

        <dl>
          <dt>Factory address</dt>
          <dd>{{ contract | abbrv }}</dd>
        </dl>

        <viewing-keys-address class="address" :account="account"></viewing-keys-address>

        <a href="" @click.prevent="showModal = false">Close</a>
      </div>
    </div>
  </div>
</template>

<script>
import Overlay from '../Overlay';
import ViewingKeysAddress from './ViewingKeysAddress';

export default {
  components: { ViewingKeysAddress, Overlay },

  props: {
    imgSrc: {
      type: String
    },
    align: {
      type: String,
      default: 'left'
    }
  },

  data() {
    return {
      showModal: false
    }
  },

  computed: {
    savedViewingKey() {
      const savedViewingKey = this.$vkeys.get(this.account, this.contract);
      this.$emit("input", savedViewingKey?.key);
      return savedViewingKey;
    },

    account() {
      return this.$store.state.$vkeys.selectedAccount?.address;
    },

    contract() {
      return this.$store.state.$contracts?.currentAddress;
    },

    alignClasses() {
      return {
        'modal--right': this.align === 'right',
        'modal--left': this.align === 'left'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vkeys {
  --vkeys-width: 32px;

  position: relative;
  width: var(--vkeys-width);

  &__wallet-icon {
    width: var(--vkeys-width);
    height: auto;

    &:not(.enabled) {
      opacity: 0.5;
    }
  }
}

// TODO move modal styles to another component
.modal {
  position: absolute;
  top: 0;

  z-index: var(--z-index-02);

  background-color: white;
  width: 400px;
  border: 1px solid black;

  &--right {
    right: 0;
  }

  &--left {
    left: 0;
  }

  &__content {
    // TODO we need to remove these styles from here.
    // These are particularly for the content of the
    // current component.

    display: grid;
    padding: var(--gutter);

    h3 { grid-area: header  }
    dl { grid-area: content }
    .address { grid-area: address }
    a  {
      grid-area: close;
      justify-self: end;
    }

    grid-template-areas: "header close" "address address" "content content";
  }
}
</style>
