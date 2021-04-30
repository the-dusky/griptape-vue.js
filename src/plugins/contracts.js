export default {
  install(Vue, options) {

    const { addresses, defaultAddress } = options;

    if (!addresses || !defaultAddress) throw new Error('Couldn\'t initialize plugin: no address or defaultAddress provided');

    const { $store } = Vue.prototype;

    $store.registerModule('$contracts', {
      namespaced: true,

      state: {
        addresses: {},
        currentAddress: null
      },

      mutations: {
        updateAddresses: (state, value) => {
          if (state.addresses[value.name]) return;

          state.addresses[value.name] = value.address;
        },

        updateCurrentAddress: (state, value) => state.currentAddress = value
      },

      actions: {
        // Adds a new address
        addAddress({ commit }, address) {
          if (!address) return;

          commit('updateAddresses', address);
        },

        // Set the default address to use in this application
        setDefaultAddress({ commit, state }, name) {
          const address = state.addresses[name];

          if (!address) return;

          commit('updateCurrentAddress', address);
        }
      }
    });

    addresses.forEach(address => $store.dispatch('$contracts/addAddress', address));
    $store.dispatch('$contracts/setDefaultAddress', defaultAddress);
  }
}
