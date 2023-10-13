<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { PlayedSong, SpotifyService } from 'src/services/spotify.service';
import { Ref, onMounted, ref, watch } from 'vue';
import SongList from './SongList.vue';
import { tap } from 'rxjs/operators';
import { BingoService } from 'src/services/bingo.service';

const spotify = SpotifyService;
const bingo = BingoService;

const advancedMode = ref(false);

watch(advancedMode, (val) => {
  spotify.advancedMode.next(val);
});
</script>
<template>
  <h3>Settings</h3>
  <q-toggle v-model="advancedMode" label="Advanced Mode"></q-toggle>
  <div>Setting here</div>
</template>
