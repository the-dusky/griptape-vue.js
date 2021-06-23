import { defineStore } from 'pinia'

export const useWalletStore = defineStore({
  id: 'wallet',

  state: () => ({
    address: undefined, // current wallet address
    balance: undefined, // current balance
    isWalletReady: false // whether the wallet is completely loaded
  }),

  actions: {
    async init() {
      try {
        this.wallet.enable()
      } catch (e) {
        // ignore
      }

      await this.updateAccount()

      this.wallet.onKeplrChange(() => {
        this.updateAccount()
      })
    },

    async updateAccount() {
      const address = await this.wallet.getAddress()
      const account = await this.scrtClient?.getAccount(address)
      if (account) {
        const balance = account.balance[0].amount
        this.$patch({ address, balance })
      }
      this.isWalletReady = true
    },

    async enable() {
      try {
        await this.wallet.enable()
        await this.updateAccount()
      } catch (e) {
        throw e
      }
    }
  }
})
