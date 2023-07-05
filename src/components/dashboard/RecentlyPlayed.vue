<script setup lang="ts">
import { SpotifyService } from 'src/services/spotify.service';
import { defineComponent, onMounted, ref } from 'vue';

const spotify = SpotifyService;

const songsToShow = ref(spotify.sessionPlayed);
const songFilter = ref('');
</script>
<template>
  <q-input square outlined v-model="songFilter" label="Filter Songs" />
  <q-list bordered class="rounded-borders">
    <q-item v-for="playlist of songsToShow" v-bind:key="playlist.id">
      <q-avatar rounded class="q-mr-md"> </q-avatar>

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

    <q-separator spaced />
  </q-list>
</template>
