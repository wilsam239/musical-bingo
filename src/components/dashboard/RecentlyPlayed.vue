<script setup lang="ts">
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, defineComponent, onMounted, ref, watch } from 'vue';
import SongList from './SongList.vue';

const spotify = SpotifyService;

const tracks: Ref<SpotifyApi.TrackObjectFull[]> = ref([]);
const songFilter = ref('');
</script>
<template>
  <q-input square outlined v-model="songFilter" label="Filter Songs" />
  <song-list :songs="spotify.sessionPlayed"></song-list>
</template>
