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
      <q-btn @click="update(true)" color="primary">Update!</q-btn>
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
function update(fromButton = false) {
  let scrub = scrubber.value;

  console.log(scrubber.value, playbackTimer.value);
  console.log(scrubber.value + playbackTimer.value);
  if (
    parseInt(scrubber.value as any) + parseInt(playbackTimer.value as any) ===
    0
  ) {
    console.info(
      'Scrubber and playback will cancel out, adjusting by 5 seconds.'
    );
    // 5 Seconds should be enough that if the requests take a little but of time to run.
    scrub -= 5;
  }

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
            if (scrub > 0) {
              return SpotifyService.scrubToSeconds(scrub);
            } else if (scrub < 0 && nextSong) {
              console.info('Going to last ' + Math.abs(scrub));

              return SpotifyService.scrubToSeconds(
                Math.round(nextSong.duration_ms / 1000) - Math.abs(scrub)
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

  if (fromButton) {
    SnackbarService.msgSuccess('Playback Update', 'Settings changed.');
  }
}
</script>
