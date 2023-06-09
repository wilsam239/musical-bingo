<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Expires In {{ expiresIn }} Minutes
        </q-toolbar-title>

        <q-btn dense flat round icon="logout" @click="spotify.logout()" />
        <q-btn dense flat round icon="refresh" @click="refreshToken" />
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <playlist-list></playlist-list>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <recently-played></recently-played>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
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
import { SpotifyService } from 'src/services/spotify.service';
import { onMounted, ref } from 'vue';

const spotify = SpotifyService;
const expiresIn = ref(0);
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

const loading = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
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
