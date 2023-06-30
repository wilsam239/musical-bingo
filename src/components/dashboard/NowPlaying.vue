<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { SpotifyService } from '../../services/spotify.service';

const spotify = SpotifyService;

const currentSong = ref('No Song Playing');

function getCurrentSong() {
  spotify
    .fetchPlaybackState()
    .subscribe((resp: SpotifyApi.CurrentPlaybackResponse): void => {
      if (resp && resp.item && resp.item.type == 'track') {
        currentSong.value = `${resp.item.name} - ${resp.item.artists
          .map((a) => a.name)
          .join(', ')}`;
        spotify.addSongToPlayed(resp.item);
      }
    });
}
onMounted(() => {
  getCurrentSong();
  setInterval(() => {
    getCurrentSong();
  }, 5000);
});
</script>
<template>
  <q-avatar>
    <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
  </q-avatar>
  <div>{{ currentSong }}</div>
</template>