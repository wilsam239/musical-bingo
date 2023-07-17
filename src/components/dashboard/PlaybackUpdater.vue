<template>
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
</template>
<style></style>

<script setup lang="ts">
import { Meta } from 'quasar';
import { Subscription, of, timer } from 'rxjs';
import { delay, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { SnackbarService } from 'src/services/snackbar.service';
import { SpotifyService } from 'src/services/spotify.service';
import { defineComponent, PropType, ref, toRef } from 'vue';

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
  if (!!playbackSub) {
    playbackSub.unsubscribe();
  }

  if (fromButton) {
    SnackbarService.msgSuccess('Playback Updated', 'Settings cleared.');
    playbackTimer.value = 30;
    scrubber.value = 0;
    pauseTimer.value = 0;
    running.value = false;
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
            return SpotifyService.fetchPlaybackState()
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
    SpotifyService.timer.next(playbackTimer.value)
    SnackbarService.msgSuccess('Playback Update', 'Settings changed.');
    running.value = true;
  }
}
</script>
