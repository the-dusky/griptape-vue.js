<template>
  <div class="keplr">
      <div class="keplr__status" :class="{ 'keplr__status--online': address }"></div>

      <secret-overlay :show="showDetails"></secret-overlay>

      <a @click="clicked">
        <img class="keplr__icon" src="../../assets/keplr-icon.svg" :class="{ 'keplr--off': keplrIsOff }">
      </a>

      <transition
        enter-active-class="animate__animated animate__flipInX"
        leave-active-class="animate__animated animate__flipOutX">

        <div v-show="showDetails" class="modal user-modal">
          <h3>Keplr account</h3>
          <a class="close" @click="showDetails = false">Close</a>
          <div v-show="address">
            <!-- this.$keplr.chainId is not reactive but there's no need, it's left here as an example -->
            <dl>
              <dt>{{ $keplr.chainId }}</dt>
              <dd>{{ address | bech32 }}</dd>
            </dl>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
import SecretOverlay from './SecretOverlay.vue';

export default {
  components: { SecretOverlay },

  data () {
    return {
      showDetails: false,
      keplrIsOff: false,
    }
  },

  computed: {
    address() {
      return this.$store.state.$keplr.selectedAccount?.address;
    },
  },

  methods: {
    async clicked() {
      if(!this.address) {
        this.$keplr.enable();
        this.toggleDetails(true);
      } else {
        this.toggleDetails();
      }
    },

    toggleDetails(value) {
      this.showDetails = value || !this.showDetails;
    },
  },
}
</script>

<style lang="scss" scoped>
.keplr {
  position: relative;
  display: flex;
  align-items: center;

  &__icon {
    width: 32px;
  }

  &__error {
    display: block;
    min-width: max-content;
    color: var(--default-error-color);
  }

  &__status {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    position: absolute;
    top: -2px;
    right: -4px;
    background-color: var(--color-negative, red);

    &--online {
      background-color: var(--color-positive, green);
    }
  }

  .user-modal {
    width: 400px;

    h3 {
      color: var(--color-purple-secondary);
    }

    dt {
      color: var(--color-blue-primary);
    }

    dd {
      margin-bottom: 0;
    }
  }

  .account {
    display: block;

    &__chain {
      text-transform: uppercase;
      font-size: 0.75em;
    }

    &__address {
      font-weight: bold;
    }
  }
}
</style>
