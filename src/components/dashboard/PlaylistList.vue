<script setup lang="ts">
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { SpotifyService } from 'src/services/spotify.service';
import { Ref, defineComponent, onMounted, ref } from 'vue';

// const spotify = SpotifyService;

const playlists: Ref<SpotifyApi.PlaylistObjectSimplified[]> = ref([]);
const playlistFilter = ref('');
const spotify = SpotifyService;
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
</script>
<template>
  <q-input square outlined v-model="playlistFilter" label="Filter Playlists" />
  <q-list bordered class="rounded-borders">
    <q-item clickable v-ripple>
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
                <!-- <q-item clickable>
                  <q-item-section avatar>
                    <q-icon name="play_arrow"></q-icon>
                  </q-item-section>
                  <q-item-section>Start Playback</q-item-section>
                </q-item> -->
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>
