import { defineStore } from 'pinia'
import { assert } from '@stakeordie/griptape.js'
import { useWalletStore } from './wallet'

const isEqual = (walletAddress, contractAddress) => {
  return vk => {
    return vk.walletAddress === walletAddress
        && vk.contractAddress === contractAddress
  }
}

export const useViewingKeysStore = defineStore({
  id: 'viewing-keys',

  enablePersist: true,

  state: () => ({
    viewingKeys: []
  }),

  getters: {
    hasKeys(state) {
      return state.viewingKeys.length !== 0
    },
  },

  actions: {
    async createViewingKey(contractAddress) {
      const walletStore = useWalletStore()
      const walletAddress = walletStore.address

      const viewingKey = this.viewingKeys
        .find(isEqual(walletAddress, contractAddress))

      // If you have already a viewing key, do nothing
      if (viewingKey) {
        return
      }

      // TODO maybe we don't want to access the wallet directly.
      // Suggest the token to keplr.
      await this.wallet.suggestToken(contractAddress)

      // Get the key from keplr if any.
      let key =
        await this.wallet.getSnip20ViewingKey(contractAddress)

      if (!key) {
        const contract = this.contractsRegistry[contractAddress]
        assert(contract, 'contract not found')
        key = await contract.createViewingKey()
      }

      this.$patch((state) => {
        state.viewingKeys.push({ walletAddress, contractAddress, key })
      })
    },

    deleteViewingKey(contractAddress) {
      const wallet = useWalletStore()

      const idx = this.viewingKeys
        .findIndex(isEqual(wallet.address, contractAddress))

      if (idx === -1) return

      this.$patch((state) => {
        state.viewingKeys.splice(idx, 1)
      })
    }
  }
})
