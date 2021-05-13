import Vue from 'vue';
import Vuex from 'vuex';

import WalletAccount from './components/wallet/WalletAccount';
import WalletInfo from './components/wallet/WalletInfo';
import { KeplrState } from './plugins/keplr';
import { VkeysState } from './plugins/vkeys';

import ViewingKeysSelector from './components/viewing-keys/ViewingKeysSelector';

import StatePersist from './plugins/state-persist';

import Griptape from './plugins/griptape';

// Importing default components styles
import './sass/styles.scss';

// Define as global components
Vue.component('WalletAccount', WalletAccount);
Vue.component('WalletInfo', WalletInfo);
Vue.component('ViewingKeysSelector', ViewingKeysSelector);

Vue.use(Vuex);

// We create the default store for all plugins
Vue.prototype.$store = new Vuex.Store({
  plugins: [StatePersist.plugin],
});

// Registering global filters
Vue.filter("abbrv", (str, abbrv) => {
  if (!str) return '';
  const half = (abbrv / 2) || 8;
  return str ? str.substring(0, half) + "..." + str.substring(str.length - half, str.length) : '';
});

export {
  Griptape,
  KeplrState,
  VkeysState
}
