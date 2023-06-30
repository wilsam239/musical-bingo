<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { SpotifyService } from '../services/spotify.service'

const spotify = SpotifyService

const nowPlaying = ref('No Song Playing')

function getCurrentSong() {
  spotify.fetchPlaybackState().subscribe((resp: SpotifyApi.CurrentPlaybackResponse): void => {
    if (resp && resp.item && resp.item.type == "track") {
      currentSong.value = `${resp.item.name} - ${resp.item.artists.map(a => a.name).join(', ')}`;
      playedSongs.add(currentSong.value);
    }
  })
}
onMounted(() => {
  spotify.fetchPlaybackState().
})
</script>
<template>
  <div>

  </div>
</template>