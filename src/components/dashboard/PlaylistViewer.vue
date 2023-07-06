<script setup lang="ts">
import { Ref, computed, defineComponent, onMounted, ref } from 'vue';
import { SpotifyService } from '../../services/spotify.service';
import PlaybackUpdater from './PlaybackUpdater.vue';
import { useRoute } from 'vue-router';
import { tap } from 'rxjs/internal/operators/tap';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import SongList from './SongList.vue';

const spotify = SpotifyService;
const route = useRoute();

let tracks: Ref<SpotifyApi.TrackObjectFull[]> = ref([]);

onMounted(() => {
  const palylistId = route.params['id'] as string;
  if (palylistId) {
    spotify
      .fetchPlaylist(palylistId)
      .pipe(
        mergeMap((playlist) => {
          return spotify.fetchPlaylistTracks(playlist);
        }),
        tap((songs) => {
          tracks.value = songs;
          console.log(songs);
        })
      )
      .subscribe();
  }
});
</script>
<template>
  <SongList :songs="tracks"></SongList>
  <div></div>
</template>
