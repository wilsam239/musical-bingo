<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/spotify-64.png" />
          </q-avatar>
          Musical Bingo
        </q-toolbar-title>

        <!-- <q-btn dense flat round icon="logout" @click="spotify.logout()" />
        <q-btn dense flat round icon="refresh" @click="refreshToken" /> -->
        <q-btn dense flat round icon="settings" @click="toggleSettingsDrawer" />
        <q-btn dense flat round icon="menu" @click="toggleHistoryDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <playlist-list></playlist-list>
    </q-drawer>

    <q-drawer show-if-above v-model="historyDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <recently-played></recently-played>
    </q-drawer>
    <q-drawer v-model="settingsDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <bingo-settings></bingo-settings>
    </q-drawer>

    <q-page-container>
      <playback-updater></playback-updater>
      <router-view></router-view>
    </q-page-container>

    <q-footer elevated class="bg-grey-10 text-white">
      <q-toolbar>
        <now-playing></now-playing>
      </q-toolbar>
    </q-footer>

    <q-inner-loading
      :showing="loading"
      label="Loading..."
      label-class="text-teal"
      label-style="font-size: 2em"
      size="lg"
    />
  </q-layout>
</template>

<script setup lang="ts">
import { tap } from 'rxjs/operators';
import NowPlaying from 'src/components/dashboard/NowPlaying.vue';
import PlaybackUpdater from 'src/components/dashboard/PlaybackUpdater.vue';
import PlaylistList from 'src/components/dashboard/PlaylistList.vue';
import RecentlyPlayed from 'src/components/dashboard/RecentlyPlayed.vue';
import BingoSettings from 'src/components/dashboard/BingoSettings.vue';
import { SpotifyService } from 'src/services/spotify.service';
import { onMounted, ref } from 'vue';

const spotify = SpotifyService;
const expiresIn = ref(0);
const leftDrawerOpen = ref(false);
const historyDrawerOpen = ref(false);
const settingsDrawerOpen = ref(false);

const loading = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleHistoryDrawer() {
  if (settingsDrawerOpen.value && !historyDrawerOpen.value) {
    toggleSettingsDrawer();
  }
  historyDrawerOpen.value = !historyDrawerOpen.value;
}

function toggleSettingsDrawer() {
  if (historyDrawerOpen.value && !settingsDrawerOpen.value) {
    toggleHistoryDrawer();
  }
  settingsDrawerOpen.value = !settingsDrawerOpen.value;
}
function refreshToken() {
  spotify.refreshToken().subscribe();
}

onMounted(() => {
  spotify.loadingState
    .pipe(
      tap((l) => {
        loading.value = l;
      })
    )
    .subscribe();
  setInterval(() => {
    expiresIn.value = Math.round((spotify.expiry - Date.now()) / 1000 / 60);
  }, 5000);
});
</script>
