<script setup lang="ts">
import { Ref, computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { SpotifyService } from '../../services/spotify.service';
import PlaybackUpdater from './PlaybackUpdater.vue';
import { filter, tap } from 'rxjs';
import {
  millisToMinutesAndSeconds,
  secondsToMinutesAndSeconds,
} from 'src/helpers/timing.helper';
import SongQueue from './SongQueue.vue';

const spotify = SpotifyService;

const song: Ref<SpotifyApi.TrackObjectFull | undefined> = ref(undefined);
const artists = ref('NA');
const name = ref('NA');
const albumImage = ref('');

const secondsElapsed = ref(0);
const timer = ref(0);

let isPlaying = false;

const timeElapsed = computed(() => {
  const result = secondsToMinutesAndSeconds(secondsElapsed.value);

  const valToCompare =
    timer.value > 0
      ? timer.value
      : Math.floor((song.value?.duration_ms ?? 0) / 1000);
  if (secondsElapsed.value < valToCompare) {
    return result;
  } else {
    return secondsToMinutesAndSeconds(valToCompare);
  }
});

const progress = computed(() => {
  const valToCompare =
    timer.value > 0
      ? timer.value
      : Math.floor((song.value?.duration_ms ?? 0) / 1000);
  return secondsElapsed.value / valToCompare;
});

const allowAdvanced = ref(false);
const bingoMode = ref(true);

onMounted(() => {
  setInterval(() => {
    if ((timer.value > 0 || song.value) && isPlaying) {
      secondsElapsed.value = secondsElapsed.value + 1;
    }
  }, 1000);

  spotify.advancedMode.pipe(tap((v) => (allowAdvanced.value = v))).subscribe();

  spotify.timer
    .pipe(
      // filter((t) => t > 0),
      tap((t) => {
        console.log(`Setting timer to ${t}`);
        timer.value = t;
        secondsElapsed.value = 0;
      })
    )
    .subscribe();

  spotify.currentPlaybackState
    .pipe(
      filter((curState) => !!curState),
      tap((curState) => {
        const updateValues = (
          curSong: SpotifyApi.TrackObjectFull,
          resetTimer = false
        ) => {
          if (curSong.id !== song.value?.id) {
            if (resetTimer) {
              secondsElapsed.value = 0;
            }
            song.value = curSong;
            name.value = curSong.name;
            artists.value = curSong.artists.map((a) => a.name).join(', ');
            albumImage.value = curSong.album.images.reduce((prev, cur) => {
              return (prev.width ?? 0) < (cur.width ?? 0) ? prev : cur;
            }).url;
            spotify.addSongToPlayed(curSong);
          }
        };
        if (curState!.item && curState!.item.type == 'track') {
          const curSong = curState!.item;
          if (timer.value === 0) {
            // No timer, so just show song progress
            secondsElapsed.value = (curState!.progress_ms ?? 0) / 1000;
            updateValues(curSong);
          } else {
            updateValues(curSong, true);
          }
        }

        isPlaying = curState?.is_playing ?? false;
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
          {{
            timer > 0
              ? secondsToMinutesAndSeconds(timer)
              : song
              ? millisToMinutesAndSeconds(song.duration_ms)
              : '0:00'
          }}
        </div>
      </div>
    </div>
    <div class="row justify-end col-3">
      <q-btn size="lg" flat dense round icon="format_list_numbered">
        <q-tooltip>Song Queue</q-tooltip>
        <q-menu class="bg-grey-9">
          <song-queue></song-queue>
        </q-menu>
      </q-btn>
      <!-- <q-btn size="lg" flat dense round icon="settings" v-if="allowAdvanced">
        <q-tooltip>Update Playback Settings</q-tooltip>
        <q-menu class="bg-grey-9">
          <playback-updater></playback-updater>
        </q-menu>
      </q-btn> -->
    </div>
  </div>
  <div class="lt-md column full-width">
    <div class="row">
      <div class="column justify-center">
        <q-avatar rounded class="q-ma-sm" id="current-album">
          <q-img :src="albumImage" />
        </q-avatar>
      </div>
      <div class="column justify-center">
        <div lines="1">
          <span class="text-weight-medium">{{ song?.name }}</span>
        </div>
        <div lines="1">
          <span class="text-weight-medium">{{
            song?.artists.map((a) => a.name).join(', ')
          }}</span>
        </div>
      </div>
      <!-- <q-btn size="lg" flat dense round icon="settings" v-if="allowAdvanced">
        <q-tooltip>Update Playback Settings</q-tooltip>
        <q-menu class="bg-grey-9">
          <playback-updater></playback-updater>
        </q-menu>
      </q-btn> -->
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
