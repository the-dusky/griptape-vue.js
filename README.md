# griptape-vue.js

griptape.js but Vue.js flavored.

## Getting Started

1. Install griptape-vue.js

```sh
yarn add griptape-vue.js
```

2. Import Griptape plugin and configure it in you main.js

```js
import { Griptape } from '@stakeordie/griptape-vue.js';

Vue.use(Griptape, {
  // Contracts that will be used in the application.
  // Commonly is one, but multiple are supported.
  // These are used particularly by the vkeys related components.
  contracts: {
    addresses: [{
      name: 'auctions',
      address: 'secret1lqdx8va86f9cff5dsz28l97x20z67qv7d4npj8'
    }],
    defaultAddress: 'auctions'
  },

  // Keplr configuration. Same as before.
  keplr: {
    chainId: 'holodeck-2',
    chainName: 'Holodeck 2',
    restUrl: 'https://bootstrap.secrettestnet.io',
    rpcUrl: 'https://bootstrap.secrettestnet.io:26667',
    isExperimental: true
  },

  // Viewing keys configuration. Right now it only supports
  // Keplr as the wallet.
  vkeys:{
    restUrl: 'https://bootstrap.secrettestnet.io'
  }
});
```

2. Use the Keplr and Vkeys componets wherever you want

```vue
<template>
  <div>
    <vkeys-wallet></vkeys-wallet>
    <keplr-user></keplr-user>
  </div>
</template>

<script>
import { KeplrUser, VkeysWallet } from '@stakeordie/griptape-vue.js';

export default {
  components: { KeplrUser, VkeysWallet },
}
</script>
```
