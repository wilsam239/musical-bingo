<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { APP_VERSION } from './assets/version';

const version = APP_VERSION;

console.log(`Running version: ${version}`);
export default defineComponent({
  name: 'App',
});
</script>
