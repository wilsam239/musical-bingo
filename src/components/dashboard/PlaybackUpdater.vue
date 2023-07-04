<template>
  <q-input square outlined v-model="timer" label="Song Timer" />
  <q-input square outlined v-model="scrubber" label="Position In Song" />
  <q-btn @click="update()">Update!</q-btn>
</template>

<script setup lang="ts">
import { Meta } from 'quasar';
import { of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { SnackbarService } from 'src/services/snackbar.service';
import { SpotifyService } from 'src/services/spotify.service';
import { defineComponent, PropType, ref, toRef } from 'vue';

const timer = ref(30);
const scrubber = ref(0);

let inetervalId: any = undefined;
function update() {
  if (!!inetervalId) {
    clearInterval(inetervalId);
  }

  inetervalId = setInterval(() => {
    SpotifyService.nextTrack()
      .pipe(
        mergeMap(() => {
          if (scrubber.value > 0) {
            return SpotifyService.scrubToSeconds(scrubber.value);
          } else {
            return of(true);
          }
        })
      )
      .subscribe(() => {
        SnackbarService.msgSuccess(
          'Playback Updated',
          `Skipped song, and scrubbed to ${scrubber.value} seconds`
        );
      });
  }, timer.value * 1000);
}
</script>
