import { defineStore } from 'pinia'
import { assert } from '@stakeordie/griptape.js'
import { useWalletStore } from '@/modules/wallet'

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

      const contract = this.contractsRegistry[contractAddress]
      assert(contract, 'contract not found')
      const contractSpec = contract.$state.spec

      if (contractSpec === 'snip-20') {
        // TODO maybe we don't want to access the wallet directly.
        // Suggest the token to keplr.
        await this.wallet.suggestToken(contractAddress)

        // Get the key from keplr if any.
        let key = await this.wallet.getSnip20ViewingKey(contractAddress)

        if (!key) {
          const response = await contract.createViewingKey()
          key = response.create_viewing_key.key
        }

        // Update state
        this.$patch((state) => {
          state.viewingKeys.push({ walletAddress, contractAddress, key })
        })

      } else {
        const response = await contract.createViewingKey()
        const key = response.viewing_key.key

        // Update state
        this.$patch((state) => {
          state.viewingKeys.push({ walletAddress, contractAddress, key })
        })
      }
    },

    deleteViewingKey(contractAddress) {
      const wallet = useWalletStore()

      const idx = this.viewingKeys
        .findIndex(isEqual(wallet.address, contractAddress))

      if (idx === -1) return

      this.$patch((state) => {
        state.viewingKeys.splice(idx, 1)
      })
    },

    getViewingKey(contractAddress) {
      const walletStore = useWalletStore()
      return this.viewingKeys
        .find(isEqual(walletStore.address, contractAddress))
    }
  }
})
