import { mapGetters } from 'vuex';

import { Keplr } from '@stakeordie/griptape.js';

const WalletState = {
  ...mapGetters('$keplr', ['wallet']),
};

const Plugin = {
  install(Vue, options) {

    Vue.prototype.$store.registerModule('$keplr', {
      namespaced: true,

      state: {
        chainInfo: {
          chainId: '',
          chainName: '',
        },

        address: '',

        accounts: []
      },

      getters: {
        wallet: (state) => {
          return state;
        }
      },

      mutations: {
        setChainInfo: (state, { chainId, chainName }) => {
          state.chainInfo.chainId = chainId;
          state.chainInfo.chainName = chainName;
        },

        selectAccount: (state, address) => {
          if (!address) {
            return;
          }

          state.accounts.forEach(account => account.selected = false);

          const account = state.accounts.find(account => account.address === address);

          if (!account) {
            const newAccount = {
              address,
              selected: true
            };

            state.accounts.push(newAccount);
          } else {
            account.selected = true;
          }

          state.address = address;
        }
      },

      actions: {
        setChainInfo: ({ commit }, chainInfo) => {
          commit('setChainInfo', chainInfo);
        },

        selectAccount: ({ commit }, address) => {
          commit('selectAccount', address);
        }
      }
    });

    Vue.filter('bech32', (str, abbrv) => {
      const half = (abbrv / 2) || 8;
      return str ? str.substring(0, half) + '...' + str.substring(str.length - half, str.length) : '';
    });

    const { chainId, chainName, restUrl, rpcUrl, isExperimental } = options;
    const keplrWallet = new Keplr(chainId, chainName, restUrl, rpcUrl, isExperimental);

    Vue.prototype.$store.dispatch('$keplr/setChainInfo', { chainId, chainName });

    keplrWallet.onAddressChanged = (newAddress) => {
      Vue.prototype.$store.dispatch('$keplr/selectAccount', newAddress);
    };

    Object.defineProperty(Vue.prototype, '$keplr', { value: keplrWallet });
  }
};

export default Plugin;
export { WalletState };
