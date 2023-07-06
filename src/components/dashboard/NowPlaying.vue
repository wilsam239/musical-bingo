<script setup lang="ts">
import { Ref, computed, defineComponent, onMounted, ref } from 'vue';
import { SpotifyService } from '../../services/spotify.service';
import PlaybackUpdater from './PlaybackUpdater.vue';

const spotify = SpotifyService;

let song: SpotifyApi.TrackObjectFull | undefined = undefined;

const currentSong = ref('No Song Playing');
const artists = ref('No Artist Information');

function getCurrentSong() {
  spotify
    .fetchPlaybackState()
    .subscribe((resp: SpotifyApi.CurrentPlaybackResponse): void => {
      if (resp && resp.item && resp.item.type == 'track') {
        song = resp.item;
        currentSong.value = song.name;
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
<template>
  <div class="row justify-between">
    <div class="row">
      <q-avatar rounded class="q-mr-md" size="lg">
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>
      <div class="column">
        <div lines="1">
          <span class="text-weight-medium">{{ currentSong }}</span>
        </div>
        <div>
          <span class="text-grey-8">{{ artists }}</span>
        </div>
      </div>
    </div>
    <div>
      <div>
        <q-btn size="lg" flat dense round icon="settings">
          <q-menu>
            <playback-updater></playback-updater>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </div>
</template>
