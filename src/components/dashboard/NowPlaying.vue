<script setup lang="ts">
import { Ref, computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { SpotifyService } from '../../services/spotify.service';
import PlaybackUpdater from './PlaybackUpdater.vue';
import { filter, tap } from 'rxjs';
import { secondsToMinutesAndSeconds } from 'src/helpers/timing.helper';

const spotify = SpotifyService;

const song: Ref<SpotifyApi.TrackObjectFull | undefined> = ref(undefined);
const artists = ref('NA');
const name = ref('NA');
const albumImage = ref('');

const secondsElapsed = ref(0);
const timeElapsed = computed(() => {
  const result = secondsToMinutesAndSeconds(secondsElapsed.value);

  if (secondsElapsed.value < timer.value) {
    return result;
  } else {
    return secondsToMinutesAndSeconds(timer.value);
  }
});
const timer = ref(0);

const progress = computed(() => {
  return secondsElapsed.value / timer.value;
});

onMounted(() => {
  setInterval(() => {
    if (timer.value > 0) {
      secondsElapsed.value = secondsElapsed.value + 1;
    }
  }, 1000);

  spotify.timer
    .pipe(
      filter((t) => t > 0),
      tap((t) => {
        console.log(`Setting timer to ${t}`);
        timer.value = t;
        secondsElapsed.value = 0;
      })
    )
    .subscribe();

  spotify.currentSong
    .pipe(
      tap((curSong) => {
        if (curSong && curSong.id !== song.value?.id) {
          secondsElapsed.value = 0;
          song.value = curSong;
          name.value = curSong.name;
          artists.value = curSong.artists.map((a) => a.name).join(', ');
          albumImage.value = curSong.album.images.reduce((prev, cur) => {
            return (prev.width ?? 0) < (cur.width ?? 0) ? prev : cur;
          }).url;
          spotify.addSongToPlayed(curSong);
        }
      })
    )
    .subscribe();
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
/* #timer-functions {
  display: contents;
} */
#timer {
  width: 30vw;
  /* margin-top: auto; */
  /* margin-bottom: auto; */
}
</style>
<template>
  <div class="row q-pa-sm gt-sm" id="now-playing-container">
    <div class="row col-3 no-wrap" id="song-info">
      <div class="column justify-center">
        <q-avatar rounded class="q-mr-md" id="current-album">
          <q-img :src="albumImage" />
        </q-avatar>
      </div>
      <!-- <marquee behavior="scroll" direction="left" scrollamount="2"> -->
      <div class="column now-playing-details justify-center col-shrink">
        <div class="text-weight-medium full-width ellipsis">
          <q-tooltip> {{ song?.name }}</q-tooltip>
          {{ song?.name }}
        </div>
        <div class="text-grey-8 full-width ellipsis">
          {{ artists }}
        </div>
      </div>
      <!-- </marquee> -->
    </div>
    <div class="row justify-center col-grow">
      <div id="timer-functions" class="row">
        <div class="column justify-center">{{ timeElapsed }}</div>
        <div class="column justify-center q-ml-sm q-mr-sm">
          <q-linear-progress
            :value="progress"
            rounded
            track-color="grey"
            id="timer"
          />
        </div>
        <div class="column justify-center">
          {{ secondsToMinutesAndSeconds(timer) }}
        </div>
      </div>
    </div>
    <div class="row justify-end col-3">
      <q-btn size="lg" flat dense round icon="format_list_numbered">
        <q-menu> Song List here </q-menu>
      </q-btn>
      <q-btn size="lg" flat dense round icon="settings">
        <q-menu>
          <playback-updater></playback-updater>
        </q-menu>
      </q-btn>
    </div>
  </div>
  <div class="lt-md column full-width">
    <div class="row justify-between">
      <div class="column justify-center">
        <q-avatar rounded class="q-ma-sm" id="current-album">
          <q-img :src="albumImage" />
        </q-avatar>
      </div>
      <div class="column justify-center">
        <div lines="1">
          <span class="text-weight-medium">{{ song?.name }}</span>
        </div>
      </div>
      <q-btn size="lg" flat dense round icon="settings">
        <q-menu>
          <playback-updater></playback-updater>
        </q-menu>
      </q-btn>
    </div>
    <div class="row full-width">
      <q-linear-progress
        :value="progress"
        rounded
        color="purple"
        track-color="orange"
        id="timer-sm"
      />
    </div>
  </div>
</template>
