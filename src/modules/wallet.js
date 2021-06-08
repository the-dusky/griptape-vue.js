import { mapGetters, mapState, mapActions } from 'vuex';
import { bech32 } from '@stakeordie/griptape.js';

export const WalletState = {
  ...mapGetters('$wallet', [
    'wallet',
  ]),
  ...mapState('$wallet', [
    'isWalletReady',
  ])
};

export const WalletActions = {
  ...mapActions('$wallet', [
    'enable'
  ])
}

export default function registerWalletStore(store, wallet, scrtClient) {

  const state = {
    address: undefined,
    balance: undefined,
    isWalletReady: false
  };

  const mutations = {
    updateAccount(state, account) {
      state.address = account?.address;
      state.balance = account?.balance;
      state.isWalletReady = true;
    }
  };

  const getters = {
    wallet(state) {
      const address = state.address;
      const abbrAddress = bech32(state.address, 12);
      const balance = state.balance ? state.balance / 1_000_000 : undefined

      return {
        address,
        abbrAddress,
        balance
      }
    }
  };

  const actions = {
    async init({ commit, dispatch }) {
      dispatch('updateAccount');
    },

    async updateAccount({ commit }) {
      const address = await wallet.getAddress();
      const account = await scrtClient.signingCosmWasmClient.getAccount(address);
      const balance = account.balance[0].amount;

      commit('updateAccount', { address, balance });
    },

    async enable({ commit, dispatch }) {
      try {
        await wallet.enable();
        dispatch('updateAccount');
      } catch (e) {
        commit('setIsWalletReady', false);
      }
    }
  };

  store.registerModule('$wallet', {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  });

  store.dispatch('$wallet/init');

  wallet.onKeplrChange(() => {
    store.dispatch('$wallet/updateAccount');
  });
};
