import Vue from 'vue';
import Vuex from 'vuex';

import { WalletState } from './plugins/keplr';
import { ViewingKeysState } from './plugins/vkeys';

import StatePersist from './plugins/state-persist';
import Griptape from './plugins/griptape';

// Importing default components styles
import './sass/styles.scss';

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
  WalletState,
  ViewingKeysState
}
