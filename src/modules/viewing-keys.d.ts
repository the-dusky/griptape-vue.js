import { Store } from 'vuex';
import { ScrtClient, Wallet, Contract } from '@stakeordie/griptape.js';
import { GriptapeVueConfig } from './griptape';

declare module './viewing-keys' {
  export default function registerViewingKeysStore(
    store: Store<any>,
    wallet: Wallet,
    scrtClient: ScrtClient,
    contract: Contract
  ): void
}
