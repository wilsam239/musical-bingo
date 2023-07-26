<template>
  <router-view />
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { APP_VERSION } from './assets/version';

const version = APP_VERSION;

console.log(`Running version: ${version}`);

export default {
  setup() {
    const $q = useQuasar();

    // calling here; equivalent to when component is created
    $q.dark.set(true);
  },
};
</script>
