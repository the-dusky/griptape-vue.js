import griptape from '@stakeordie/griptape.js';
import { useStore } from 'vuex';

export default {
    install: (app, { store }) => {

        store.registerModule('$griptape', {
            namespaced: true,

            state: {
                // The minting inflation.
                inflation: null
            },

            getters: {
                getInflation: state => state.inflation
            },

            mutations: {
                updateInflation: (state, inflation) => {
                    state.inflation = inflation;
                }
            },

            actions: {
                // Update the minting inflation
                async updateInflation(context) {
                    const inflation = await griptape.mint.getInflation();

                    // For now we don't need to transform the response in any
                    // way. Consider to transform it if needed.
                    context.commit('updateInflation', inflation);
                }
            }
        });

        // griptape entry-point
        const api = {
            updateInflation() {
                store.dispatch('$griptape/updateInflation');
            }
        };

        app.provide('$griptape', api);
    }
}
