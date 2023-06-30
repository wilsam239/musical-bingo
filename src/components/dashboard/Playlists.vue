<script setup lang="ts">
import { defineComponent, onMounted } from 'vue';

// const spotify = SpotifyService;

const playlists = ['Playlist 1', 'Playlist 2'];

onMounted(() => {
  console.log('Playlists mounted');
});
</script>
<template>
  <div v-for="playlist of playlists" v-bind:key="playlist">
    {{ playlist }}
  </div>
</template>
