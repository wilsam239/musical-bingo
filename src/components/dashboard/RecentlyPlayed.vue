<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { PlayedSong, SpotifyService } from 'src/services/spotify.service';
import { Ref, ref, watch } from 'vue';
import SongList from './SongList.vue';

const spotify = SpotifyService;
let allSongs: PlayedSong[] = spotify.sessionPlayed;
const songs: Ref<SpotifyApi.TrackObjectFull[]> = ref(
  allSongs.map((s) => s.song)
);
const songFilter = ref('');

const filter = useDebounceFn(() => {
  console.log('Filtering with: ' + songFilter.value);
  if (!songFilter.value) {
    songs.value = allSongs.map((s) => s.song);
  }
  songs.value = allSongs
    .map((s) => s.song)
    .filter((p) =>
      p.name.toLowerCase().includes(songFilter.value.toLowerCase())
    );
}, 300);

watch(
  () => allSongs,
  (played) => {
    if (!songFilter.value) {
      songs.value = played.map((s) => s.song);
    }
  }
);
watch(
  () => spotify.sessionPlayed,
  (played) => {
    console.info('All songs updated to session played');
    allSongs = played;
  }
);
</script>
<template>
  <q-input
    square
    outlined
    v-model="songFilter"
    label="Filter Songs"
    @update:model-value="filter"
  />
  <song-list :songs="songs"></song-list>
</template>
