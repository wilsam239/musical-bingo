<template>
  <div id="song-queue-container">
    <q-inner-loading
      :showing="loading"
      label="Loading..."
      label-class="text-teal"
      label-style="font-size: 2em"
      size="lg"
    />

    <song-list :songs="songs" :mini="true"></song-list>
  </div>
</template>
<style lang="scss">
#song-queue-container {
  width: 300px;
  max-height: 300px;
  min-height: 300px;
}
</style>

<script setup lang="ts">
import { map, tap } from 'rxjs/operators';
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, onMounted, ref } from 'vue';
import SongList from './SongList.vue';

const spotify = SpotifyService;
const songs: Ref<SpotifyApi.TrackObjectFull[]> = ref([]);
const loading = ref(true);

onMounted(() => {
  spotify
    .fetchQueue()
    .pipe(
      map((res) => res.queue as SpotifyApi.TrackObjectFull[]),
      tap((queue) => {
        console.log(queue);
        songs.value = [...queue];
        loading.value = false;
        console.log(songs.value);
      })
    )
    .subscribe();
});
</script>
