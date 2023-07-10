<script setup lang="ts">
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { tap } from 'rxjs/internal/operators/tap';
import { Ref, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SpotifyService } from '../../services/spotify.service';
import SongList from './SongList.vue';

const spotify = SpotifyService;
const route = useRoute();

let playlist: Ref<SpotifyApi.PlaylistObjectFull | undefined> = ref(undefined);
let tracks: Ref<SpotifyApi.TrackObjectFull[]> = ref([]);

const loading = ref(true);

function fetchPlaylist(id: string) {
  spotify
    .fetchPlaylist(id)
    .pipe(
      tap((pl) => {
        playlist.value = pl;
      }),
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
<style>
.playlist-image {
  max-width: 200px;
  min-width: 200px;
  width: 200px;
}
#playlist-title {
  width: 75%;
}

#playlist-title,
#playlist-description {
  max-width: 75%;
}
</style>
<template>
  <div class="column">
    <!-- <div class="row justify-between q-mt-md q-ml-md q-mr-md">
      <q-btn round color="secondary" icon="chevron_left" to="/dashboard" />
      <q-btn color="secondary" icon="note_add" label="Generate Bingo Cards" />
    </div> -->
    <div class="row no-wrap q-ma-md">
      <q-img
        :src="
          playlist?.images.reduce((prev, cur) => {
            return (prev.width ?? 0) > (cur.width ?? 0) ? prev : cur;
          }).url
        "
        class="playlist-image q-mr-md shadow-2 rounded-borders"
      />
      <div class="column justify-center">
        <div class="text-weight-bolder ellipsis text-h2" id="playlist-title">
          {{ playlist?.name }}
        </div>
        <div class="text-grey-8" id="playlist-description">
          {{ playlist?.description }}
        </div>
        <div class="text-grey-5 q-mt-lg" id="playlist-info">
          {{ playlist?.tracks.total }} Songs
        </div>
      </div>
      <div class="row"></div>
    </div>
    <div class="row q-mb-md q-ml-md q-mr-md">
      <q-btn round size="lg" color="primary" icon="note_add" class="q-mr-lg">
        <q-tooltip> Generate Bingo Cards </q-tooltip>
      </q-btn>
      <q-btn flat size="lg" round color="primary" icon="playlist_add">
        <q-tooltip> Make sub playlist </q-tooltip>
      </q-btn>
    </div>
    <SongList :songs="tracks" :mini="false"></SongList>
  </div>
</template>
