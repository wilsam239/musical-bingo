<script setup lang="ts">
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, defineComponent, onMounted, ref } from 'vue';

// const spotify = SpotifyService;

const playlists: Ref<SpotifyApi.PlaylistObjectSimplified[]> = ref([]);
const playlistFilter = ref('');
const spotify = SpotifyService;
onMounted(() => {
  spotify
    .fetchPlaylists()
    .pipe(
      tap((playlistsFound) => {
        playlists.value = playlistsFound;
      })
    )
    .subscribe();
});
</script>
<template>
  <q-input square outlined v-model="playlistFilter" label="Filter Playlists" />
  <div v-for="playlist of playlists" v-bind:key="playlist.id">
    {{ playlist.name }}
  </div>
</template>
