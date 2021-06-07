import { Store } from 'vuex'

declare module './state-persist' {
  export const statePersist: (store: Store<any>) => void
}
