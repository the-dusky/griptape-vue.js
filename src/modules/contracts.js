import { defineStore } from 'pinia'
import {
  defineContract,
  defineSnip20Contract
} from '@stakeordie/griptape.js'

// Transforms a contract definition in a pinia store.
function createStoreFromContract(id, contractDefinition) {
  const {
    contractAddress,
    state,
    messages,
    queries,
    spec
  } = contractDefinition
  const store = {
    id,
    state: () => ({
      contractAddress,
      spec,
      ...state,
    }),
    actions: {
      ...messages,
      ...queries
    }
  }
  return defineStore(store)
}

// Creates a contract on a contract defintion.
export function createContract(id, contractAddress, contractDef) {
  const def = defineContract(contractAddress, contractDef)
  return createStoreFromContract(id, def)
}

// Creates an SNIP-20 contract and add extend for a contract definition if
// needed.
export function createSnip20Contract(id, contractAddress, contractDef) {
  const def = defineSnip20Contract(contractAddress, contractDef)
  return createStoreFromContract(id, def)
}

// Global registry for contracts.
export const registry = {}

function isContract(store) {
  return typeof store.$state.contractAddress !== 'undefined'
      && typeof store.$state.spec !== 'undefined'
}

// Pinia plugin for accesing all the contracts in the application by id.
export const contractRegistry = ({ store }) => {
  if (isContract(store) && !registry[store.$id]) {
    registry[store.$state.contractAddress] = store
  }
}
