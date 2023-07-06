<script setup lang="ts">
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, defineComponent, mergeProps, onMounted, ref, watch } from 'vue';

const spotify = SpotifyService;

const props = defineProps<{
  songs: SpotifyApi.TrackObjectFull[];
}>();
</script>
<template>
  <q-list bordered class="rounded-borders">
    <q-item v-for="playlist of songs" v-bind:key="playlist.id">
      <q-avatar rounded class="q-mr-md">
        <img
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
</template>
