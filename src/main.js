import KeplrAccount from './components/keplr/KeplrAccount';
import KeplrUser from './components/keplr/KeplrUser';

import VkeysAddress from './components/wallet/VkeysAddress';
import VkeysWallet from './components/wallet/VkeysWallet';

import Keplr from './plugins/keplr';
import VKeys from './plugins/vkeys';
import StatePersist from './plugins/state-persist';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// We create the default store for all plugins
Vue.prototype.$store = new Vuex.Store({
  plugins: [StatePersist.plugin],
});

StatePersist.start();

export {
  // Keplr components and plugins
  Keplr,
  KeplrAccount,
  KeplrUser,

  // Viewing keys components and plugins
  VKeys,
  VkeysAddress,
  VkeysWallet
}
