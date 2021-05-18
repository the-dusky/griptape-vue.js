<template>
  <div class="app-vkey" :class="{ hidden }">
    <div v-if="!account">
      <p>Please log in using your<br>Keplr wallet</p>
    </div>

    <div v-if="account">
      <div class="no-key" v-if="!savedViewingKey && !viewingKey">
        <div class="vkey-error" v-if="isInError && !isInProgress">
          <p>Error creating your viewing key. Do you have enough SCRT?</p>
        </div>
        <loading-icon v-if="isInProgress">
          <p>Creating viewing key...</p>
        </loading-icon>
        <div v-if="!isInProgress">
          <slot name="description">
          <small>A viewing key allows to interact with the private state of the contract.</small>
          </slot>
          <button class="no-button" @click.prevent="createViewingKey">&#x1F511; Create viewing key</button>
          <button class="no-button" @click.prevent="isViewingKeyVisible = true; viewingKey = { key: '' }">&#x1F511; Enter key</button>
        </div>
      </div>

      <div class="saved-key" v-if="savedViewingKey && !isViewingKeyVisible">
        <button @click.prevent="isViewingKeyVisible = true">&#x1F511; Show viewing key</button>
      </div>

      <div class="vkey" v-if="viewingKey && isViewingKeyVisible">
        <div class="vkey__tools" v-if="viewingKey == savedViewingKey">
          <dl>
            <dt>Viewing key</dt>
            <dd class="vkey__saved-key">
            {{ viewingKey.key }}
            </dd>
          </dl>
          <a class="hide"  href="" @click.prevent="hideViewingKey">Hide</a>
          <a class="forget" v-if="savedViewingKey" href="" @click.prevent="forgetViewingKey">Forget</a>
        </div>
        <div class="vkey__tools" v-if="viewingKey != savedViewingKey">
          <dl>
            <dt>Viewing key</dt>
          </dl>
          <textarea class="vkey__key" v-model.trim="viewingKey.key"></textarea>
          <a class="save" href="" @click.prevent="saveViewingKey">Save</a>
          <a class="remove" href="" @click.prevent="deleteViewingKey">Delete</a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import LoadingIcon from '../LoadingIcon.vue';

export default {
  components: { LoadingIcon },
  props: {
    hidden: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      isViewingKeyVisible: false,
      isInError: false,
      isInProgress: false,
      viewingKey: null,
    }
  },
  watch: {
    account() {
      this.viewingKey = null;
    }
  },
  computed: {
    savedViewingKey() {
      let savedKey = this.$vkeys.get(this.account, this.contract);
      if(savedKey) {
        this.$emit("input", savedKey);
        this.viewingKey = Object.assign(savedKey);
      }
      return savedKey;
    },

    account() {
      return this.$store.state.$keplr.selectedAccount?.address;
    },

    contract() {
      return this.$store.state.$contracts?.currentAddress;
    }
  },
  methods: {
    async saveViewingKey() {
      this.$vkeys.put(this.account, this.contract, this.viewingKey.key);
    },
    async forgetViewingKey() {
      this.$vkeys.delete(this.account, this.contract);
      this.viewingKey = null;
    },
    hideViewingKey() {
      this.isViewingKeyVisible = false;
    },
    deleteViewingKey() {
      this.viewingKey = null;
    },
    async createViewingKey() {
      try {
        this.isInProgress = true;
        this.viewingKey = { key: await this.$vkeys.create(this.account, this.contract) };
        await this.saveViewingKey();

        this.isViewingKeyVisible = true;
        this.isInProgress = false;
        this.isInError = false;
      } catch(err) {
        this.isInProgress = false;
        this.isInError = err.message.indexOf('rejected') < 0;
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.app-vkey {
  &.hidden {
    display: none;
  }

  button {
    width: 100%;
    font-weight: 600;
    margin-bottom: 0;

    &:hover {
      color: black;
      background-color: var(--color-white-secondary);
    }
  }
}
.vkey-error p {
  color: var(--color-negative);
}
.vkey {
  &__key {
    margin-bottom: 1em;
  }
  &__saved-key {
    padding-top: 6px;
    word-break: break-word;
    line-height: 1.5em;
  }
  &__tools {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-evenly;
    row-gap: 10px;
    column-gap: 25px;

    dt{
      font-size: 0.75em;
    }

    dl {
      margin-right: auto;
    }

    textarea {
      width: 100%;
      border-style: solid;
      outline: none;
      border-radius: 0.3em;
      font-size: 14px;
      border-color: #999;
      border-width: 1px;
    }

    a {
      font-size: 0.8em;
      font-weight: 600;
      text-decoration: none;
      text-transform: uppercase;

      &.hide {
        color: var(--color-turquoise-secondary);
      }
      &.save {
        color: green;
      }
      &.remove, &.forget {
        color: red;
      }
    }
  }
}
small {
  display: block;
  font-size: 13px;
  line-height: 1.5em;
  text-align: justify;
  margin-bottom: 0.5em;
}
</style>
