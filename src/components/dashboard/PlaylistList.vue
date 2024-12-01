<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { tap, filter, map } from 'rxjs/operators';
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, onMounted, ref } from 'vue';
import GeneratorDialog from './GeneratorDialog.vue';

// const spotify = SpotifyService;

let allPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
const playlists: Ref<SpotifyApi.PlaylistObjectSimplified[]> = ref([]);
const playlistFilter = ref('');
const spotify = SpotifyService;

const openNewDialog: Ref<'playlist' | 'bingo' | 'both' | undefined> =
  ref(undefined);

const selectedPlaylist: Ref<string | undefined> = ref(undefined);

const filterFn = useDebounceFn(() => {
  console.log('Filtering with: ' + playlistFilter.value);
  if (!playlistFilter.value) {
    playlists.value = allPlaylists;
  }
  playlists.value = allPlaylists.filter((p) =>
    p.name.toLowerCase().includes(playlistFilter.value.toLowerCase())
  );
}, 300);

onMounted(() => {
  spotify
    .fetchPlaylists()
    .pipe(
      map((r) => r.filter((p) => p !== null)),
      tap((playlistsFound) => {
        allPlaylists = playlistsFound;
        playlists.value = playlistsFound;
        spotify.loading = false;
      })
    )
    .subscribe();

  spotify.createdPlaylist
    .pipe(
      filter((p) => !!p),
      tap((playlist) => {
        allPlaylists.push(playlist!);
        playlists.value = [playlist!, ...playlists.value];
      })
    )
    .subscribe();
});

function createNewPlaylist(playlist?: SpotifyApi.PlaylistObjectSimplified) {
  openNewDialog.value = 'playlist';
  selectedPlaylist.value = playlist?.id;
  console.log(
    "Open the dialog, with mode 'playlist', passing in the playlist id"
  );
}

function generateBingoSheets(playlist: SpotifyApi.PlaylistObjectSimplified) {
  openNewDialog.value = 'bingo';
  selectedPlaylist.value = playlist?.id;
  console.log("Open the dialog, with mode 'bingo', passing in the playlist id");
}
</script>
<template>
  <q-input
    square
    outlined
    v-model="playlistFilter"
    label="Filter Playlists"
    @update:model-value="filterFn"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
  <q-list bordered class="rounded-borders">
    <q-item clickable v-ripple @click="createNewPlaylist()">
      <q-item-section avatar>
        <q-avatar
          rounded
          color="green"
          text-color="white"
          icon="add"
          size="48px"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <span class="text-weight-medium"> Add New Playlist </span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-for="playlist of playlists"
      v-bind:key="playlist.id"
      clickable
      v-ripple
      :to="'/dashboard/' + playlist.id"
    >
      <q-avatar rounded class="q-mr-md">
        <q-img :src="playlist.images?.at(0)?.url" />
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
            <q-tooltip>{{ playlist.description }}</q-tooltip>
            {{ playlist.description }}
          </span>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            size="12px"
            flat
            dense
            round
            icon="more_vert"
            v-on:click.prevent
          >
            <q-menu auto-close class="bg-grey-9">
              <q-list>
                <q-item clickable @click="generateBingoSheets(playlist)">
                  <q-item-section avatar>
                    <q-icon name="note_add"></q-icon>
                  </q-item-section>
                  <q-item-section>Create Bingo Cards</q-item-section>
                </q-item>
                <!-- <q-item clickable>
                  <q-item-section avatar>
                    <q-icon name="preview"></q-icon>
                  </q-item-section>
                  <q-item-section>View</q-item-section>
                </q-item> -->
                <q-item clickable @click="createNewPlaylist(playlist)">
                  <q-item-section avatar>
                    <q-icon name="playlist_add"></q-icon>
                  </q-item-section>
                  <q-item-section>Create Subplaylist</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-list>

  <GeneratorDialog
    :dialog_mode="openNewDialog"
    :playlist="selectedPlaylist"
  ></GeneratorDialog>
</template>
