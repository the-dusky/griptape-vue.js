<template>
  <div class="keplr">

    <a href="#" @click.prevent="enableWallet">
      <img v-if="!imgSrc" class="keplr__wallet-icon" src="../../assets/keplr-icon.svg" alt="wallet icon">
      <img v-else class="keplr__wallet-icon" :src="imgSrc" alt="wallet icon">
    </a>

    <div class="keplr__status" :class="statusClasses">
      <img v-if="!onlineIcon" src="../../assets/online-icon.svg" alt="online icon">
      <img v-if="!offlineIcon" src="../../assets/offline-icon.svg" alt="offline icon">
    </div>

    <overlay :show="showDetails"></overlay>

    <div class="modal" v-show="showDetails">
      <div class="modal__content">

        <h3>Keplr account</h3>

        <a href="#" @click.prevent="toggleDetails(false)">Close</a>

        <dl v-show="address">
          <dt>{{ chainId }}</dt>
          <dd>{{ address | bech32 }}</dd>
        </dl>

      </div>
    </div>
  </div>
</template>

<script>
import Overlay from '../Overlay.vue';

export default {
  components: { Overlay },

  props:{
    imgSrc: {
      type: String
    },
    onlineIcon: {
      type: String
    },
    offlineIcon: {
      type: String
    }
  },

  data () {
    return {
      showDetails: false
    }
  },

  computed: {
    address() {
      return this.$store.state.$keplr.selectedAccount?.address;
    },

    chainId() {
      return this.$store.state.$keplr.chainInfo.chainId;
    },

    statusClasses() {
      return {
        'keplr__status--online': this.address,
        'keplr__status--offline': !this.address
      }
    }
  },

  methods: {
    async enableWallet() {
      if(!this.address) {
        this.$keplr.enable();
        this.toggleDetails(true);
      } else {
        this.toggleDetails();
      }
    },

    toggleDetails(value) {
      this.showDetails = value || !this.showDetails;
    }
  },
}
</script>

<style lang="scss" scoped>
.keplr {
  --wallet-icon-width: 32px;
  --wallet-status-icon-width: 8px;

  position: relative;
  width: var(--wallet-icon-width);

  &__wallet-icon {
    width: var(--wallet-icon-width);
  }

  &__status {
    position: absolute;
    width: var(--wallet-status-icon-width);
    height: var(--wallet-status-icon-width);
    top: calc(var(--wallet-status-icon-width) / -4);
    right: calc(var(--wallet-status-icon-width) / -4);

    img {
      display: none;
    }

    &--online {
      img[src*=online]  { display: block; }
    }

    &--offline {
      img[src*=offline] { display: block; }
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

  &__content {
    // TODO we need to remove these styles from here.
    // These are particularly for the content of the
    // current component.

    display: grid;
    padding: var(--gutter);

    h3 { grid-area: header  }
    dl { grid-area: content }
    a  {
      grid-area: close;
      justify-self: end;
    }

    grid-template-areas: "header close" "content content";
  }
}
</style>
