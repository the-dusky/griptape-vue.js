import Vue from 'vue';
import Vuex from 'vuex';

import KeplrAccount from './components/keplr/KeplrAccount';
import KeplrUser from './components/keplr/KeplrUser';

import VkeysWallet from './components/wallet/VkeysWallet';

import StatePersist from './plugins/state-persist';

import Griptape from './plugins/griptape';

// Importing default components styles
import './sass/styles.scss';

// Define as global components
Vue.component('KeplrAccount', KeplrAccount);
Vue.component('KeplrUser', KeplrUser);
Vue.component('VkeysWallet', VkeysWallet);

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
  // Keplr
  KeplrAccount,
  KeplrUser,

  // Viewing keys
  VkeysWallet,

  Griptape
}
