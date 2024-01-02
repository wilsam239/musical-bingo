<script setup lang="ts">
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, defineComponent, mergeProps, onMounted, ref, watch } from 'vue';
import { millisToMinutesAndSeconds } from 'src/helpers/timing.helper';
import { tap } from 'rxjs';

const spotify = SpotifyService;

const props = defineProps<{
  songs: SpotifyApi.TrackObjectFull[];
  mini: boolean;
}>();

const currentId = ref('');
onMounted(() => {
  spotify.currentTrackId
    .pipe(
      tap((id) => {
        currentId.value = id;
        console.log('Currently playing: ' + currentId.value);
      })
    )
    .subscribe();
});
function play(index: number) {
  if (props.mini) {
    return;
  } else {
    spotify
      .addToQueue(...props.songs.slice(index, props.songs.length))
      .subscribe(() => {
        const id = props.songs[index].id;
        currentId.value = id;
      });
  }
}
</script>
<style lang="scss">
.now-playing {
  color: $primary;
}
.song-text-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.song-number {
  width: 14px;
}
</style>
<template>
  <div v-if="mini">
    <q-list bordered class="rounded-borders">
      <q-item
        v-for="(song, index) of songs"
        v-bind:key="song.id + '_' + index"
        v-bind:class="song.id == currentId ? 'now-playing' : ''"
      >
        <q-avatar rounded class="q-mr-md">
          <q-img
            :src="
              song.album.images.reduce((prev, cur) => {
                return (prev.width ?? 0) < (cur.width ?? 0) ? prev : cur;
              }).url
            "
          />
        </q-avatar>

        <q-item-section>
          <q-item-label lines="1">
            <span class="text-weight-medium">
              <q-tooltip>{{ song.name }}</q-tooltip>
              {{ song.name }}
            </span>
          </q-item-label>
          <q-item-label lines="1">
            <span v-bind:class="song.id == currentId ? '' : 'text-grey-8'">
              <q-tooltip>
                {{ song.artists.map((a) => a.name).join(', ') }}
              </q-tooltip>
              {{ song.artists.map((a) => a.name).join(', ') }}
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
          clickable
          v-on:click="play(index)"
          v-for="(song, index) of songs"
          v-bind:key="song.id + '_' + index"
          v-bind:class="song.id == currentId ? 'now-playing' : ''"
        >
          <div class="column justify-center q-mr-md song-number">
            <div v-if="song.id == currentId">
              <q-spinner></q-spinner>
            </div>
            <div v-else>
              {{ index + 1 }}
            </div>
          </div>
          <q-item-section avatar rounded class="q-mr-md">
            <q-img
              class="rounded-borders"
              :src="
                song.album.images.reduce((prev, cur) => {
                  return (prev.width ?? 0) < (cur.width ?? 0) ? prev : cur;
                }).url
              "
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="song-text-label">{{ song.name }}</q-item-label>
            <span class="song-text-label text-grey-8">
              {{ song.artists.map((a) => a.name).join(', ') }}
            </span>
          </q-item-section>
          <q-item-section>
            <q-item-label class="song-text-label text-grey-8">{{
              song.album.name
            }}</q-item-label>
          </q-item-section>

          <q-item-section side class="q-mr-lg">
            <q-item-label lines="1">
              <span v-bind:class="song.id == currentId ? '' : 'text-grey-8'">
                {{ millisToMinutesAndSeconds(song.duration_ms) }}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
