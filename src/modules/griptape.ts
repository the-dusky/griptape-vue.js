import { createApp, markRaw } from 'vue'
import { createPinia, defineStore } from 'pinia'
import { grip, GriptapeConfig } from '@stakeordie/griptape.js'

import WalletInfo from '../components/WalletInfo.vue'
import ViewingKeyManager from '../components/ViewingKeyManager.vue'
import { useWalletStore } from './wallet'
import { useViewingKeysStore } from './viewing-keys'
import { statePersist } from '../modules/state-persist'
import { contractRegistry, registry } from './contracts'

const griptapeGlue = {
  install(app: any, options: any) {
    const { wallet, scrtClient, pinia } = options

    // Register global components
    app.component('WalletInfo', WalletInfo)
    app.component('ViewingKeyManager', ViewingKeyManager)

    // Init pinia plugins
    pinia.use(({ store }: any) => {
      store.wallet = markRaw(wallet)
      store.scrtClient = markRaw(scrtClient)
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
  preMount: Function
): Promise<void> {

  return new Promise<void>(async (resolve, reject) => {
    try {

      // Create and setup the application.
      const app = createApp(rootComponent)
      const pinia = createPinia()
      const options = {
        mountId: '#app'
      }

      // Grip the application.
      const griptape = await grip(conf)

      // Register the glue plugin.
      app.use(griptapeGlue, { ...griptape, pinia })

      // Needed to initialize the app, but also there are some
      // issues if all the stores are not initialize/called
      // here.
      const wallet = useWalletStore(pinia)
      wallet.init()
      useViewingKeysStore(pinia)

      // Pre mount the app for user specific components, plugins.
      preMount(app, pinia, options)

      // Mount the application.
      app.mount(options.mountId)

      // Resolve the promise, provide the app and pinia instances.
      resolve({ app, pinia, options })

    } catch (e) {
      reject(e)
    }
  })
}
