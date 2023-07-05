<template>
  <q-input square outlined v-model="playbackTimer" label="Song Timer" />
  <q-input square outlined v-model="scrubber" label="Position In Song" />
  <q-input square outlined v-model="pauseTimer" label="Time between songs" />
  <q-btn @click="update()">Update!</q-btn>
</template>

<script setup lang="ts">
import { Meta } from 'quasar';
import { Subscription, of, timer } from 'rxjs';
import { delay, mergeMap, switchMap, tap } from 'rxjs/operators';
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
      switchMap(() => pause().pipe(switchMap(() => SpotifyService.nextTrack())))
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
