<script setup lang="ts">
import { SpotifyService } from 'src/services/spotify.service';
import { defineComponent, onMounted, ref } from 'vue';
import SongList from './SongList.vue';

const spotify = SpotifyService;

const tracks = ref([]);
const songFilter = ref('');
</script>
<template>
  <q-input square outlined v-model="songFilter" label="Filter Songs" />
  <song-list :songs="spotify.sessionPlayed"></song-list>
</template>
