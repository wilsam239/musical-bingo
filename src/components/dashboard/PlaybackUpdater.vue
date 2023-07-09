<template>
  <div class="playback-update-container">
    <div class="spaced-inputs">
      <q-input square outlined v-model="playbackTimer" label="Song Timer" />
      <q-input square outlined v-model="scrubber" label="Position In Song" />
      <q-input
        square
        outlined
        v-model="pauseTimer"
        label="Time between songs"
      />
    </div>
    <div class="row justify-center q-mb-sm">
      <q-btn @click="update()" color="primary">Update!</q-btn>
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

let playbackSub: Subscription | undefined = undefined;

function pause() {
  if (pauseTimer.value > 0) {
    return SpotifyService.pause().pipe(delay(pauseTimer.value * 1000));
  } else {
    return of('');
  }
}
function update() {
  if (!!playbackSub) {
    playbackSub.unsubscribe();
  }

  playbackSub = timer(playbackTimer.value * 1000)
    .pipe(
      switchMap(() =>
        pause().pipe(
          switchMap(() =>
            SpotifyService.fetchQueue().pipe(
              map((response) => response.queue.at(0))
            )
          ),
          switchMap((nextSong) =>
            SpotifyService.nextTrack().pipe(map(() => nextSong))
          ),
          switchMap((nextSong) => {
            if (scrubber.value > 0) {
              return SpotifyService.scrubToSeconds(scrubber.value);
            } else if (scrubber.value < 0 && nextSong) {
              console.info('Going to last ' + Math.abs(scrubber.value));
              return SpotifyService.scrubToSeconds(
                nextSong.duration_ms / 1000 - Math.abs(scrubber.value)
              );
            } else {
              return of(true);
            }
          })
        )
      )
    )
    .subscribe(() => {
      SnackbarService.msgSuccess(
        'Playback Updated',
        `Skipped song, and scrubbed to ${scrubber.value} seconds`
      );
      update();
    });
}
</script>
