<script setup lang="ts">
import { SpotifyService } from 'src/services/spotify.service';
import { defineComponent, onMounted, ref } from 'vue';

const spotify = SpotifyService;

const songsToShow = ref(spotify.sessionPlayed);
</script>
<template>
  <div v-for="song of songsToShow" v-bind:key="song.id">
    {{ song.name }}
  </div>
</template>
