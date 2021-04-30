const storageKey = '__app';

const statePersist = {
  store: null,
  hasStarted: false,
  loadFromStorage: (storageKey) => {
      return JSON.parse(localStorage.getItem(storageKey));
  },
  saveToStorage: (storageKey, obj) => {
      localStorage.setItem(storageKey, JSON.stringify(obj));
  },

  plugin: (store) => {
    statePersist.store = store;
    statePersist.store.subscribe((mutation, state) => {
      if(statePersist.hasStarted) {
        statePersist.saveToStorage(storageKey, state);
      }
    });
  },

  start: () => {
    const storedState = statePersist.loadFromStorage(storageKey);
    if (storedState) {
      // This doesn't work... 
      //     Uncaught Error: [vuex] use store.replaceState() to explicit replace store state.
      // Vue.set(store, "state", storedState);

      // This doesn't work either...
      //store.replaceStore(storedState);

      // Individual entities have to be restored so reactivity is not
      // messed up
      statePersist.store.state.$vkeys.vkeys = storedState.$vkeys.vkeys;
    }
    statePersist.hasStarted = true;
  },
};

export default statePersist;
