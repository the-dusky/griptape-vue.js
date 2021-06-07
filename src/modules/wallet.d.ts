import { Store } from 'vuex';
import { KeplrWallet, ScrtClient } from '@stakeordie/griptape.js';

declare module './wallet' {
  export default function registerWalletStore(
    store: Store<any>,
    wallet: KeplrWallet,
    scrtClient: ScrtClient
  ): void
}
