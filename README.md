# griptape-vue.js

griptape.js but Vue.js flavored.

## Getting Started

1. Install griptape-vue.js

```sh
yarn add @stakeordie/griptape-vue.js
```

2. Import Griptape plugin and configure it in you main.js

```js
import { Griptape } from '@stakeordie/griptape-vue.js';

Vue.use(Griptape, {
  // Contracts that will be used in the application.
  // Commonly is one, but multiple are supported.
  // These are used particularly by the vkeys related components.
  contracts: {
    addresses: [
      {
        name: "auctions",
        address: "secret1lqdx8va86f9cff5dsz28l97x20z67qv7d4npj8",
      },
    ],
    defaultAddress: "auctions",
  },

  // Keplr configuration. Same as before.
  chain: {
    chainId: "holodeck-2",
    chainName: "Holodeck 2",
    restUrl: "https://bootstrap.secrettestnet.io",
    rpcUrl: "https://bootstrap.secrettestnet.io:26667",
    isExperimental: true,
  },

  // Viewing keys configuration. Right now it only supports
  // Keplr as the wallet.
  vkeys: {
    restUrl: "https://bootstrap.secrettestnet.io",
  },
});
```

3. Use the Keplr and Vkeys componets wherever you want (auto imported to you Vue instance).

```vue
<template>
  <div>
    <vkeys-wallet></vkeys-wallet>
    <keplr-user></keplr-user>
  </div>
</template>
```

4. Use mapState to call the info that is storage in your modules, and access the state values in your Vue template, as the next example.

> Take a look at KeplrState and VkeysState mixins

```vue
<template>
  <div v-for="vkey in vkeys" :key="vkey.userAddress">
    <p>User Address: {{ vkey.userAddress }}</p>
    <ul>
      <li v-for="v in vkey.viewingKeys" :key="v.key">Key: {{ v.key }}</li>
    </ul>
  </div>
</template>

<script>
// Import mapState
import { mapState } from "vuex";

export default {
  computed: {
    // Call to mapState
    // As first parameteter recives the module name and second the state.
    ...mapState("$vkeys", ["vkeys"]),
  },
};
</script>
```

## Developers Guide

Check out developers guide [here](./DEVELOPERS.md)
