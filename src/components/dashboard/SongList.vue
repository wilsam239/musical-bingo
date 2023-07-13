<script setup lang="ts">
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, defineComponent, mergeProps, onMounted, ref, watch } from 'vue';

const spotify = SpotifyService;

const props = defineProps<{
  songs: SpotifyApi.TrackObjectFull[];
  mini: boolean;
}>();

function millisToMinutesAndSeconds(millis: number) {
  let minutes = Math.floor(millis / 60000);
  let seconds = (millis % 60000) / 1000;

  let fixedSeconds = seconds.toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + fixedSeconds;
}
</script>
<template>
  <div v-if="mini">
    <q-list bordered class="rounded-borders">
      <q-item
        v-for="(playlist, index) of songs"
        v-bind:key="playlist.id + '_' + index"
      >
        <q-avatar rounded class="q-mr-md">
          <q-img
            :src="
              playlist.album.images.reduce((prev, cur) => {
                return (prev.width ?? 0) < (cur.width ?? 0) ? prev : cur;
              }).url
            "
          />
        </q-avatar>

        <q-item-section>
          <q-item-label lines="1">
            <span class="text-weight-medium">
              <q-tooltip>{{ playlist.name }}</q-tooltip>
              {{ playlist.name }}
            </span>
          </q-item-label>
          <q-item-label lines="1">
            <span class="text-grey-8">
              <q-tooltip>
                {{ playlist.artists.map((a) => a.name).join(', ') }}
              </q-tooltip>
              {{ playlist.artists.map((a) => a.name).join(', ') }}
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <div v-else>
    <div>
      <q-list>
        <q-item
          v-for="(playlist, index) of songs"
          v-bind:key="playlist.id + '_' + index"
        >
          <q-item-section avatar rounded class="q-mr-md">
            <q-img
              class="rounded-borders"
              :src="
                playlist.album.images.reduce((prev, cur) => {
                  return (prev.width ?? 0) < (cur.width ?? 0) ? prev : cur;
                }).url
              "
            />
          </q-item-section>

          <q-item-section class="col-2">
            <q-item-label>{{ playlist.name }}</q-item-label>
          </q-item-section>

          <q-item-section class="gt-sm">
            <q-item-label lines="1">
              <span class="text-grey-8">
                {{ playlist.artists.map((a) => a.name).join(', ') }}
              </span>
            </q-item-label>
          </q-item-section>
          <q-item-section side class="q-mr-md">
            <q-item-label lines="1">
              <span class="text-grey-8">
                {{ millisToMinutesAndSeconds(playlist.duration_ms) }}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
