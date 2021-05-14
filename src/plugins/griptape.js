import Contracts from './contracts';
import Keplr from './keplr';
import VKeys from './vkeys';
import StatePersist from './state-persist';

import WalletInfo from '../components/wallet/WalletInfo';
import ViewingKeysSelector from '../components/viewing-keys/ViewingKeysSelector';

export default {
  install(Vue, options) {
    Vue.use(Contracts, options.contracts);
    Vue.use(Keplr, options.chain);
    Vue.use(VKeys, { restUrl: options.chain.restUrl, wallet: Vue.prototype.$keplr });

    Vue.component('WalletInfo', WalletInfo);
    Vue.component('ViewingKeysSelector', ViewingKeysSelector);

    StatePersist.start();
  }
};
