const storageKey = '__griptape-vue.js';

export const statePersist = (store) => {

  let init = false;

  store.subscribe((mutation, state) => {
    if (store.hasModule('$viewingKeys')
      && mutation.type !== '$viewingKeys/init') {

      if (!init) {
        const persistedState = JSON.parse(localStorage.getItem(storageKey));
        if (persistedState) {
          store.commit('$viewingKeys/init', persistedState);
        }
        init = true;
      } else {
        localStorage.setItem(storageKey, JSON.stringify(state.$viewingKeys));
      }
    }
  });
};
