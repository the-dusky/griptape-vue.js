<template>
  <div class="wallet">

    <!-- Enable wallet action -->
    <a href="#"
       @click.prevent="enable"
       class="wallet__content"
       v-if="!isWalletReady">
       Enable Keplr
    </a>

    <!-- Main content -->
    <div class="wallet__content" v-else>
      <img src="../assets/wallet.svg" alt="wallet icon">
      <span>{{ wallet.abbrAddress }} | {{ wallet.balance }} SCRT</span>
    </div>

  </div>
</template>

<script>
import Loading from './Loading.vue';
import { WalletState, WalletActions } from '../modules/wallet';

export default {
  components: { Loading },

  // TODO improve method call namespacing
  methods: {
    ...WalletActions
  },

  computed: {
    ...WalletState
  }
}
</script>

<style lang="scss" scoped>
.wallet {
  --wallet-width: 254px;
  --wallet-height: 46px;
  --wallet-border: 1px solid black;
  --wallet-border-radius: 4px;

  width: 100%;
  max-width: var(--wallet-width);
  height: var(--wallet-height);
  border: var(--wallet-border);
  border-radius: var(--wallet-border-radius);

  &__content {
    width: 100%;
    height: 100%;

    display: grid;
    grid-auto-flow: column;
    grid-column-gap: var(--gutter);
    place-items: center center;

    img {
      justify-self: end;
    }

    span {
      justify-self: start;
    }
  }
}
</style>
