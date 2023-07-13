<script setup lang="ts">
import { Ref, computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { SpotifyService } from '../../services/spotify.service';
import PlaybackUpdater from './PlaybackUpdater.vue';

const spotify = SpotifyService;

const song: Ref<SpotifyApi.TrackObjectFull | undefined> = ref(undefined);
const artists = ref('NA');
const name = ref('NA');
const albumImage = ref('');
const progress = ref(0);

function getCurrentSong() {
  spotify
    .fetchPlaybackState()
    .subscribe((resp: SpotifyApi.CurrentPlaybackResponse): void => {
      if (
        resp &&
        resp.item &&
        resp.item.type == 'track' &&
        resp.item.id !== song.value?.id
      ) {
        progress.value = 0;
        song.value = resp.item;
        name.value = resp.item.name;
        artists.value = resp.item.artists.map((a) => a.name).join(', ');
        albumImage.value = resp.item.album.images.reduce((prev, cur) => {
          return (prev.width ?? 0) < (cur.width ?? 0) ? prev : cur;
        }).url;
        spotify.addSongToPlayed(resp.item);
      }
    });
}
onMounted(() => {
  setInterval(() => {
    progress.value = progress.value + 30 / 1000;
  }, 1000);
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

#now-playing-container {
  width: 100%;
}

#current-album {
  width: 50px;
  height: 50px;
}
#timer-functions {
  display: contents;
}
#timer {
  width: 30%;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
<template>
  <div class="row justify-between q-pa-sm" id="now-playing-container">
    <div class="row" id="song-info">
      <div class="column justify-center">
        <q-avatar rounded class="q-mr-md" id="current-album">
          <q-img :src="albumImage" />
        </q-avatar>
      </div>
      <!-- <marquee behavior="scroll" direction="left" scrollamount="2"> -->
      <div class="column now-playing-details justify-center">
        <div lines="1">
          <span class="text-weight-medium">{{ song?.name }}</span>
        </div>
        <div>
          <span class="text-grey-8">{{ artists }}</span>
        </div>
      </div>
      <!-- </marquee> -->
    </div>
    <div id="timer-functions">
      <q-linear-progress
        :value="progress"
        rounded
        color="purple"
        track-color="orange"
        id="timer"
      />
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
