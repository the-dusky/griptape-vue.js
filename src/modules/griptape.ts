import { createStore } from 'vuex';
import {
  grip,
  GriptapeConfig,
  Contract
} from '@stakeordie/griptape.js';
import { statePersist } from './state-persist';

import registerWalletStore from './wallet';
import registerViewingKeyStore from './viewing-keys';

export function gripVueJsApp(app: any, conf: GriptapeConfig): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const griptape = await grip(conf);
      const { wallet, scrtClient } = griptape;
      const store = createStore({ plugins: [statePersist] });

      // Initializing contract
      const { instance, address } = conf.contract;
      instance.setAddress(address);
      instance.setScrtClient(scrtClient);

      // Registering modules
      registerWalletStore(store, wallet, scrtClient);
      registerViewingKeyStore(store, wallet, scrtClient, instance);

      app.use(store);

      resolve();

    } catch (e) {
      reject(e);
    }
  });
}
