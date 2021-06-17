declare module '@/modules/griptape' {}

declare module '@/modules/wallet' {
  export const useWalletStore: Function
}

declare module '@/modules/viewing-keys' {
  export const useViewingKeysStore: Function
}

declare module '@/modules/contracts' {
  export const registry: object
  export const contractRegistry: Function
}

declare module '@/modules/state-persist' {
  export const statePersist: Function
}
