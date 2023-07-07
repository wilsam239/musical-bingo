<script setup lang="ts">
import { create } from 'domain';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, defineComponent, onMounted, ref } from 'vue';

// const spotify = SpotifyService;

const playlists: Ref<SpotifyApi.PlaylistObjectSimplified[]> = ref([]);
const playlistFilter = ref('');
const spotify = SpotifyService;

const openNewDialog = ref(false);
const alreadyHasURL = ref(false);

// DIALOG VARIABLES
let usePlaylist: SpotifyApi.PlaylistObjectSimplified | undefined = undefined;
const newUrl = ref('');
const newName = ref('');
const newSongCount = ref(50);
const newGenerateBingo = ref(false);
const bingoSheetCount = ref(20);
const bingoSubtitle = ref('');

onMounted(() => {
  spotify
    .fetchPlaylists()
    .pipe(
      tap((playlistsFound) => {
        playlists.value = playlistsFound;
        spotify.loading = false;
      })
    )
    .subscribe();
});

function createNewPlaylist(playlist?: SpotifyApi.PlaylistObjectSimplified) {
  if (playlist) {
    usePlaylist = playlist;
    newUrl.value = playlist.external_urls.spotify;
    console.log('already have url ', newUrl.value);
  } else {
    console.log('Get url from user');
  }

  openNewDialog.value = true;
}
</script>
<template>
  <q-input square outlined v-model="playlistFilter" label="Filter Playlists" />
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
        <img :src="playlist.images.at(0)?.url" />
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
            <q-menu auto-close>
              <q-list>
                <q-item clickable>
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
                    <q-icon name="pencil"></q-icon>
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

  <q-dialog v-model="openNewDialog">
    <q-card>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>

        <q-toolbar-title
          >Configure New Playlist
          <span v-if="alreadyHasURL">
            from {{ usePlaylist?.name }}</span
          ></q-toolbar-title
        >

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-input
          square
          outlined
          v-if="!alreadyHasURL"
          v-model="newUrl"
          label="Playlist URL"
        />
        <q-input square outlined v-model="newName" label="Playlist Name" />
        <q-input
          square
          outline
          v-model="newSongCount"
          label="Number Of Songs To Use"
        />

        <q-toggle v-model="newGenerateBingo" label="Generate Bingo Cards" />
      </q-card-section>

      <q-card-section v-if="newGenerateBingo">
        <q-input
          square
          outline
          v-model="bingoSubtitle"
          label="Bingo Subtitle eg: Sponsor, theme, etc"
        />
        <q-input
          square
          outline
          v-model="bingoSheetCount"
          label="Number Of Bingo Sheets"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
