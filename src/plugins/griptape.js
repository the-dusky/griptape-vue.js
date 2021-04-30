import Contracts from './contracts';
import Keplr from './keplr';
import VKeys from './vkeys';
import StatePersist from './state-persist';

export default {
  install(Vue, options) {
    Vue.use(Contracts, options.contracts);
    Vue.use(Keplr, options.keplr);
    Vue.use(VKeys, {
      ...options.vkeys,
      wallet: Vue.prototype.$keplr
    });

    StatePersist.start();
  }
};
