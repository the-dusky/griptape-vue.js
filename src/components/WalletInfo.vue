<template>
  <div class="wallet">

    <!-- Enable wallet action -->
    <a href="#"
       class="wallet__content"
       @click.prevent="enable"
       v-show="!isWalletReady">
       Enable Keplr
    </a>

    <!-- Main content -->
    <div class="wallet__content" v-show="isWalletReady">
      <img src="../assets/wallet.svg" alt="wallet icon">
      <span>{{ bech32(address) }} | {{ balance }} SCRT</span>
    </div>

  </div>
</template>

<script>
import { bech32 } from '@stakeordie/griptape.js'
import { mapState, mapActions } from 'pinia'
import { useWalletStore } from '@/modules/wallet'

export default {
  methods: {
    ...mapActions(useWalletStore, ['enable'])
  },

  methods: {
    bech32
  },

  computed: {
    ...mapState(useWalletStore, [
      'address',
      'balance',
      'isWalletReady'
    ])
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
