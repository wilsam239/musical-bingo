<script setup lang="ts">
import { RouterView } from 'vue-router';
import { APP_VERSION } from './assets/version';

const version = APP_VERSION

console.log(`Running version: ${version}`)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
