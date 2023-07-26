<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { PlayedSong, SpotifyService } from 'src/services/spotify.service';
import { Ref, onMounted, ref, watch } from 'vue';
import SongList from './SongList.vue';
import { tap } from 'rxjs/operators';

const spotify = SpotifyService;
let allSongs: Ref<PlayedSong[]> = ref([]);
const songs: Ref<SpotifyApi.TrackObjectFull[]> = ref(
  allSongs.value.map((s) => s.song)
);
const songFilter = ref('');

const filter = useDebounceFn(() => {
  console.log('Filtering with: ' + songFilter.value);
  if (!songFilter.value) {
    songs.value = allSongs.value.map((s) => s.song);
  }
  songs.value = allSongs.value
    .map((s) => s.song)
    .filter((p) =>
      p.name.toLowerCase().includes(songFilter.value.toLowerCase())
    );
}, 300);

function clearRecentlyPlayed() {
  spotify.clearRecentlyPlayed();
}

watch(
  () => allSongs.value,
  (played) => {
    if (!songFilter.value) {
      songs.value = played.map((s) => s.song);
    }
  },
  {
    deep: true,
  }
);

onMounted(() => {
  spotify.storeSessionPlayed
    .pipe(
      tap((played) => {
        allSongs.value = [...played];
      })
    )
    .subscribe();
});
</script>
<template>
  <q-input
    square
    v-model="songFilter"
    label="Filter Songs"
    @update:model-value="filter"
    class="q-ml-md"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>

    <template v-slot:after>
      <q-btn
        round
        dense
        flat
        icon="clear"
        @click="clearRecentlyPlayed()"
        class="q-mr-md"
      >
        <q-tooltip>Clear Recently Played Songs</q-tooltip>
      </q-btn>
    </template>
  </q-input>
  <song-list :songs="songs" :mini="true"></song-list>
</template>
