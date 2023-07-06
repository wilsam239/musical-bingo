<script setup lang="ts">
import { Ref, computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { SpotifyService } from '../../services/spotify.service';
import PlaybackUpdater from './PlaybackUpdater.vue';

const spotify = SpotifyService;

let song:
  | SpotifyApi.TrackObjectFull
  | { name: string; artists: [{ name: string }] } = reactive({
  name: 'NA',
  artists: [{ name: 'NA' }],
});

const artists = ref('No Artist Information');

function getCurrentSong() {
  spotify
    .fetchPlaybackState()
    .subscribe((resp: SpotifyApi.CurrentPlaybackResponse): void => {
      if (resp && resp.item && resp.item.type == 'track') {
        song = resp.item;
        artists.value = song.artists.map((a) => a.name).join(', ');
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
<style>
.now-playing-details {
  /* max-width: 300px; */
}
</style>
<template>
  <div class="row justify-between">
    <div class="row">
      <div class="column justify-center">
        <q-avatar rounded class="q-mr-md" size="lg">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>
      </div>
      <!-- <marquee behavior="scroll" direction="left" scrollamount="2"> -->
      <div class="column now-playing-details">
        <div lines="1">
          <span class="text-weight-medium">{{ song?.name }}</span>
        </div>
        <div>
          <span class="text-grey-8">{{ artists }}</span>
        </div>
      </div>
      <!-- </marquee> -->
    </div>
    <div class="column justify-center">
      <q-btn size="lg" flat dense round icon="settings">
        <q-menu>
          <playback-updater></playback-updater>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
