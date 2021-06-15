// Stores the are already registered
const stores = []

// The key used by `localStorage.setItem`
const storageKey = '__griptape.js'

// Pinia plugin for persisting data on local storage
export const statePersist = ({ store, options }) => {

  // Check if the store was already registered and if the store has the state
  // persists enabled.
  if (!stores.includes(store.$id)
    && (typeof options.enablePersist !== 'undefined'
      && options.enablePersist)) {

    const data = localStorage.getItem(storageKey)

    if (data) {
      store.$state = JSON.parse(data)
    }

    store.$subscribe((event) => {
      localStorage.setItem(storageKey, JSON.stringify(store.$state))
    })

    stores.push(store.$id)
  }
}
