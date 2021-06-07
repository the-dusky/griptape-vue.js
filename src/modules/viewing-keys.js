import { mapGetters, mapActions } from 'vuex';

export const ViewingKeysState = {
  ...mapGetters('$viewingKeys', [
    'viewingKeys',
    'hasViewingkeys'
  ])
};

export const ViewingKeysActions = {
  ...mapActions('$viewingKeys', [
    'createViewingKey',
    'putViewingKey',
    'deleteViewingKey'
  ])
};

export default function registerViewingKeysStore(
  store, wallet, scrtClient, contract) {

  const state = {
    viewingKeys: [], // Array<ViewingKey>
    currentViewingKey: undefined // string
  };

  const getters = {
    viewingKeys(state) {
      return {
        keys: state.viewingKeys,
        current: state.currentViewingKey
      }
    },

    hasViewingkeys(state) {
      return state.viewingKeys.length !== 0;
    }
  };

  const mutations = {
    addViewingKey(state, vk) {
      state.viewingKeys.push(vk);
    },

    setCurrentViewingKey(state, vk) {
      state.currentViewingKey = vk;
    },

    deleteViewingKey(state, { walletAddr, contractAddr }) {
      const vkIndex = state.viewingKeys
        .find(vk => vk.walletAddr === walletAddr
                 && vk.contractAddr === contractAddr);
      if (vkIndex !== -1) {
        state.viewingKeys.splice(vkIndex, 1);
      }
    },

    init(state, initState) {
      state.viewingKeys = initState.viewingKeys;
      state.currentViewingKey = initState.currentViewingKey;
    }
  };

  const actions = {
    async createViewingKey({ state, commit }) {
      const walletAddr = await wallet.getAddress();
      const contractAddr = contract.address;

      const userHasAlreadyAKey = state.viewingKeys
        .find(vk => vk.walletAddr === walletAddr
                 && vk.contractAddr === contractAddr);

      if (userHasAlreadyAKey) {
        commit('setCurrentViewingKey', userHasAlreadyAKey);
        return;
      }

      const viewingKey = await contract.createViewingKey();
      commit('addViewingKey', { viewingKey, walletAddr, contractAddr });
      commit('setCurrentViewingKey', viewingKey);
    },

    async putViewingKey({ commit }, viewingKey) {
      const walletAddr = await wallet.getAddress();
      const contractAddr = contract.address;
      commit('addViewingKey', { viewingKey, walletAddr, contractAddr });
      commit('setCurrentViewingKey', viewingKey);
    },

    async deleteViewingKey({ commit }) {
      const walletAddr = await wallet.getAddress();
      const contractAddr = contract.address;
      commit('deleteViewingKey', { walletAddr, contractAddr });
      commit('setCurrentViewingKey');
    }
  };

  store.registerModule('$viewingKeys', {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  });
}
