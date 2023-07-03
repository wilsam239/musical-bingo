<script setup lang="ts">
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { SpotifyService } from 'src/services/spotify.service';
import { defineComponent, onMounted } from 'vue';

// const spotify = SpotifyService;

const playlists = ['Playlist 1', 'Playlist 2'];
const spotify = SpotifyService;
onMounted(() => {
  console.log('Playlists mounted');
  spotify
    .fetchPlaylists()
    .pipe(
      map((resp) => {
        return resp.items;
      }),
      tap((playlists: SpotifyApi.PlaylistObjectFull) => {
        console.log(playlists);
      })
    )
    .subscribe();
});
</script>
<template>
  <div v-for="playlist of playlists" v-bind:key="playlist">
    {{ playlist }}
  </div>
</template>
