<script setup lang="ts">
import { Ref, computed, defineComponent, onMounted, ref, watch } from 'vue';
import { SpotifyService } from '../../services/spotify.service';
import PlaybackUpdater from './PlaybackUpdater.vue';
import { useRoute } from 'vue-router';
import { tap } from 'rxjs/internal/operators/tap';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import SongList from './SongList.vue';

const spotify = SpotifyService;
const route = useRoute();

let tracks: Ref<SpotifyApi.TrackObjectFull[]> = ref([]);

const loading = ref(true);

function fetchPlaylist(id: string) {
  spotify
    .fetchPlaylist(id)
    .pipe(
      mergeMap((playlist) => {
        return spotify.fetchPlaylistTracks(playlist);
      }),
      tap((songs) => {
        tracks.value = songs;
        console.log(songs);
        spotify.loading = false;
      })
    )
    .subscribe();
}
watch(route, (r) => {
  if (r.params['id']) {
    spotify.loadingState.next(true);
    fetchPlaylist(r.params['id'] as string);
  }
});

onMounted(() => {
  if (route.params['id']) {
    spotify.loadingState.next(true);
    fetchPlaylist(route.params['id'] as string);
  }
});
</script>
<template>
  <SongList :songs="tracks"></SongList>
</template>
