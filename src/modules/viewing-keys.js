import { defineStore } from 'pinia'
import { assert } from '@stakeordie/griptape.js'
import { useWalletStore } from './wallet'

const isEqual = (walletAddr, contractAddr) => {
  return vk => {
    return vk.walletAddr === walletAddr
        && vk.contractAddr === contractAddr
  }
}

const isContractIdEqual = (contractId) => {
  return vk => {
    return vk.contractId === contractId
  }
}

const getContract = (contracts, contractId) => {
  const contract = contracts[`contract/${contractId}`]
  assert(contract, `Contract ${contractId} does not exist`)
  return contract
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
    async createViewingKey(contractId) {
      const wallet = useWalletStore()
      const contract = getContract(this.contractsRegistry, contractId)

      const viewingKey = this.viewingKeys
        .find(isEqual(wallet.address, contract.$state.contractAddress))

      if (viewingKey) {
        return
      }

      const keplr = this.wallet.keplr
      const chainId = this.wallet.chainId

      await keplr.suggestToken(chainId, contract.contractAddress)

      let key =
        await keplr.getSecret20ViewingKey(chainId, contract.contractAddress)

      if (!key) {
        key = await contract.createViewingKey()
      }

      this.$patch((state) => {
        state.viewingKeys.push({
          contractId,
          walletAddr: wallet.address,
          contractAddr: contract.$state.contractAddress,
          key
        })
      })
    },

    addViewingKey(contractId, key) {
      const wallet = useWalletStore()
      const contract = getContract(this.contractsRegistry, contractId)

      const viewingKey = this.viewingKeys
        .find(isEqual(wallet.address, contract.$state.contractAddress))

      if (viewingKey) {
        return
      }

      this.$patch((state) => {
        state.viewingKeys.push({
          contractId,
          walletAddr: wallet.address,
          contractAddr: contract.$state.contractAddress,
          key
        })
      })
    },

    deleteViewingKey(contractId) {
      const wallet = useWalletStore()
      const contract = getContract(this.contractsRegistry, contractId)

      const idx = this.viewingKeys
        .findIndex(isEqual(wallet.address, contract.$state.contractAddress))

      if (idx !== -1) {
        this.$patch((state) => {
          state.viewingKeys.splice(idx, 1)
        })
      }
    },

    getViewingKey(contractId) {
      return this.viewingKeys.find(isContractIdEqual(contractId))
    }
  }
})
