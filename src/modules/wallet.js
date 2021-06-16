import { defineStore } from 'pinia'

export const useWalletStore = defineStore({
  id: 'wallet',

  state: () => ({
    address: '', // current wallet address
    balance: 0, // current balance
    isWalletReady: false // whether the wallet is completely loaded
  }),

  actions: {
    async init() {
      await this.updateAccount()

      this.wallet.onKeplrChange(() => {
        this.updateAccount()
      })
    },

    async updateAccount() {
      const address = await this.wallet.getAddress()
      const account = await this.scrtClient.getAccount(address)
      const balance = account.balance[0].amount
      this.$patch({ address, balance, isWalletReady: true })
    },

    async enable() {
      try {
        await wallet.enable()
        this.updateAccount()
      } catch (e) {
        throw e
      }
    }
  }
})
