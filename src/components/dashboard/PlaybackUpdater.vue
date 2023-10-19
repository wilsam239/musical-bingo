<template>
  <div v-if="allowAdvanced">
    <div class="playback-update-container">
      <div class="spaced-inputs">
        <q-input
          square
          outlined
          v-model="playbackTimer"
          label="Song Timer"
          type="number"
          min="0"
          oninput="this.value =
 !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
        />
        <q-input
          square
          outlined
          v-model="scrubber"
          label="Position In Song"
          type="number"
        />
        <q-input
          square
          outlined
          v-model="pauseTimer"
          label="Time between songs"
          type="number"
          min="0"
          oninput="this.value =
 !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
        />
      </div>
      <div class="row justify-around q-mb-sm">
        <q-btn
          :disable="isDisabled()"
          @click="update(scrubber, playbackTimer, pauseTimer, true)"
          color="primary"
        >
          Update!
        </q-btn>
        <q-btn :disable="!running" @click="clear(true)" color="warning">
          Clear!
        </q-btn>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="q-ma-sm">
      <q-btn-toggle
        v-model="mode"
        spread
        no-caps
        rounded
        class="bg-grey-9"
        :options="[
          {
            label: 'Bingo Mode',
            value: 'bingo',
            icon: mode == 'trivia' ? 'stop' : 'play_arrow',
          },
          {
            label: 'Trivia Mode',
            value: 'trivia',
            icon: mode == 'bingo' ? 'stop' : 'play_arrow',
          },
          {
            label: 'Clear Timer',
            value: 'clear',
            icon: 'cancel',
          },
        ]"
      ></q-btn-toggle>
    </div>
  </div>
  <q-dialog v-model="browserWarn">
    <q-card>
      <q-card-section>
        <div class="text-h6">Incompatible Browser</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Unfortunately, this browser is not supported. In order to use the app
        you will need to ensure the display remains on in settings, or use
        Chrome.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style></style>

<script setup lang="ts">
import { Subscription, of, timer } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { SnackbarService } from 'src/services/snackbar.service';
import { SpotifyService } from 'src/services/spotify.service';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const allowAdvanced = ref(false);
const mode = ref('');
const playbackTimer = ref(30);
const scrubber = ref(0);
const pauseTimer = ref(0);
const running = ref(false);

let playbackSub: Subscription | undefined = undefined;

function isDisabled() {
  if (scrubber.value < 0 && Math.abs(scrubber.value) < playbackTimer.value) {
    return true;
  }
  return false;
}

function pause(pauseVal: number) {
  if (pauseVal > 0) {
    return SpotifyService.pause().pipe(delay(pauseVal * 1000));
  } else {
    return of('');
  }
}

function clear(fromButton = false) {
  console.log('clearing');
  if (!!playbackSub) {
    playbackSub.unsubscribe();
  }

  if (fromButton) {
    SnackbarService.msgSuccess('Playback Updated', 'Settings cleared.');
    playbackTimer.value = 30;
    scrubber.value = 0;
    pauseTimer.value = 0;
    running.value = false;
    SpotifyService.timer.next(0);
  }
}
function update(
  scrubberVal: number,
  playbackVal: number,
  pauseVal: number,
  fromButton = false
) {
  let scrub = scrubberVal;

  console.log(
    `Scrubber ${scrubberVal}, Playback ${playbackVal}, Pause ${pauseVal}`
  );

  if (parseInt(scrubberVal as any) + parseInt(playbackVal as any) === 0) {
    console.info(
      'Scrubber and playback will cancel out, adjusting by 5 seconds.'
    );
    // 5 Seconds should be enough that if the requests take a little but of time to run.
    scrub -= 5;
  }

  clear();

  playbackSub = timer(playbackVal * 1000)
    .pipe(
      switchMap(() =>
        pause(pauseVal).pipe(
          switchMap(() =>
            SpotifyService.fetchQueue().pipe(
              map((response) => response.queue.at(0))
            )
          ),
          switchMap((nextSong) =>
            SpotifyService.nextTrack().pipe(map(() => nextSong))
          ),
          switchMap((nextSong) => {
            if (scrub > 0) {
              return SpotifyService.scrubToSeconds(scrub);
            } else if (scrub < 0 && nextSong) {
              console.info('Going to last ' + Math.abs(scrub) + ' seconds');

              return SpotifyService.scrubToSeconds(
                Math.round(nextSong.duration_ms / 1000) - Math.abs(scrub)
              );
            } else {
              return of(true);
            }
          }),
          switchMap(() => {
            return SpotifyService.fetchPlaybackState();
          })
        )
      )
    )
    .subscribe(() => {
      SnackbarService.msgSuccess(
        'Playback Updated',
        `Skipped song, and scrubbed to ${scrubberVal} seconds`
      );
      update(scrubberVal, playbackVal, pauseVal);
    });

  if (fromButton) {
    SpotifyService.timer.next(playbackTimer.value);
    SnackbarService.msgSuccess('Playback Update', 'Settings changed.');
    running.value = true;
  }
}

watch(mode, (m) => {
  SpotifyService.playbackMode.next(m);
  if (m !== 'clear') {
    if (m == 'trivia') {
      playbackTimer.value = 20;
      pauseTimer.value = 1;
      scrubber.value = 0;
    } else if (m == 'bingo') {
      playbackTimer.value = 30;
      pauseTimer.value = 0;
      scrubber.value = 0;
    }
    update(scrubber.value, playbackTimer.value, pauseTimer.value, true);
  } else {
    clear(true);
  }
});

const wakeLock = ref<any>(null);

const requestWakeLock = async () => {
  wakeLock.value = await navigator.wakeLock.request('screen');
  SnackbarService.msgInfo('Wake Lock enabled', '');
};

const browserWarn = ref(false);
onMounted(() => {
  if ('wakeLock' in navigator) {
    requestWakeLock();
  } else {
    browserWarn.value = screen.width <= 760;
  }
  SpotifyService.advancedMode
    .pipe(tap((v) => (allowAdvanced.value = v)))
    .subscribe();
});
</script>
