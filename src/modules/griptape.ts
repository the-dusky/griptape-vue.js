import { createApp, markRaw } from 'vue'
import { createPinia, defineStore } from 'pinia'
import {
  GriptapeConfig,
  useWallet,
  createScrtClient
} from '@stakeordie/griptape.js'

import WalletInfo from '@/components/WalletInfo.vue'
import ViewingKeyManager from '@/components/ViewingKeyManager.vue'
import { useWalletStore } from '@/modules/wallet'
import { useViewingKeyStore } from '@/modules/viewing-keys'
import { statePersist } from '@/modules/state-persist'
import { contractRegistry, registry } from '@/modules/contracts'

const griptapeGlue = {
  install(app: any, options: any) {
    const { wallet, scrtClient, pinia } = options

    // Register global components
    app.component('WalletInfo', WalletInfo)
    app.component('ViewingKeyManager', ViewingKeyManager)

    // Init pinia plugins
    pinia.use(({ store }: any) => {
      store.wallet = wallet ? markRaw(wallet) : undefined
      store.scrtClient = scrtClient ? markRaw(scrtClient) : undefined
      store.contractsRegistry = markRaw(registry)
    })
    pinia.use(statePersist)
    pinia.use(contractRegistry)
    app.use(pinia)
  }
}

export function gripVueJsApp(
  conf: GriptapeConfig,
  rootComponent: any,
  preMount?: Function
): Promise<object> {

  return new Promise<object>(async (resolve, reject) => {
    try {

      // Create and setup the application.
      const app = createApp(rootComponent)
      const pinia = createPinia()
      const options = {
        mountId: '#app'
      }

      // Get the wallet and scrtClient
      const wallet = await useWallet()
      const scrtClient = await createScrtClient(conf.restUrl, wallet)

      // Register the glue plugin.
      app.use(griptapeGlue, { wallet, scrtClient, pinia })

      // Needed to initialize the app, but also there are some
      // issues if all the stores are not initialize/called
      // here.
      const walletStore = useWalletStore(pinia)
      useViewingKeyStore(pinia)

      // Pre mount the app for user specific components, plugins.
      if (preMount) {
        preMount(app, pinia, options)
      }

      // Mount the application.
      app.mount(options.mountId)

      // Init the wallet store.
      await walletStore.init()

      // Resolve the promise, provide the app and pinia instances.
      resolve({ app, pinia, options })

    } catch (e) {
      reject(e)
    }
  })
}
