<script setup lang="ts">
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { tap } from 'rxjs/internal/operators/tap';
import { Ref, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SpotifyService } from '../../services/spotify.service';
import GeneratorDialog from './GeneratorDialog.vue';
import SongList from './SongList.vue';

const spotify = SpotifyService;
const route = useRoute();

const playlist: Ref<SpotifyApi.PlaylistObjectFull | undefined> = ref(undefined);
const tracks: Ref<SpotifyApi.TrackObjectFull[]> = ref([]);

const openNewDialog: Ref<'playlist' | 'bingo' | undefined> = ref(undefined);
const loading = ref(true);

function fetchPlaylist(id: string) {
  spotify
    .fetchPlaylist(id)
    .pipe(
      tap((pl) => {
        playlist.value = pl;
        console.log('COLOUR: ' + (pl as any).primary_color);
      }),
      mergeMap((playlist) => {
        return spotify.fetchPlaylistTracks(playlist);
      }),
      tap((songs) => {
        tracks.value = songs;
        console.log(songs);
        spotify.loading = false;
      })
    )
    .subscribe();
}
watch(route, (r) => {
  if (r.params['id']) {
    spotify.loadingState.next(true);
    fetchPlaylist(r.params['id'] as string);
  }
});

onMounted(() => {
  if (route.params['id']) {
    spotify.loadingState.next(true);
    fetchPlaylist(route.params['id'] as string);
  }
});
</script>
<style lang="scss">
#playlist-description {
  word-break: break-all;
}

body.screen--lg {
  #playlist-title {
    font-size: 3.5em;
  }
  .playlist-image {
    width: 250px;
    height: 250px;
    min-width: 250px;
    min-height: 250px;
  }
}
body.screen--md {
  #playlist-title {
    font-size: 2.5em;
  }
  .playlist-image {
    width: 200px;
    height: 200px;
    min-width: 200px;
    min-height: 200px;
  }
}
body.screen--sm {
  #playlist-title {
    font-size: 1.5em;
  }
  .playlist-image {
    width: 150px;
    height: 150px;
    min-width: 150px;
    min-height: 150px;
  }
}
body.screen--xs {
  #playlist-title {
    font-size: 1em;
  }
  .playlist-image {
    width: 100px;
    height: 100px;
    min-width: 100px;
    min-height: 100px;
  }
}

/* 
#playlist-title {
  width: 75%;
}

#playlist-title,
#playlist-description {
  max-width: 75%;
} */
</style>
<template>
  <div class="column">
    <!-- <div class="row justify-between q-mt-md q-ml-md q-mr-md">
      <q-btn round color="secondary" icon="chevron_left" to="/dashboard" />
      <q-btn color="secondary" icon="note_add" label="Generate Bingo Cards" />
    </div> -->
    <div class="row no-wrap q-ma-md" id="playlist-header">
      <div class="column justify-center">
        <q-img
          :src="
            playlist?.images.reduce((prev, cur) => {
              return (prev.width ?? 0) > (cur.width ?? 0) ? prev : cur;
            }).url
          "
          class="playlist-image q-mr-md shadow-2 rounded-borders"
        />
      </div>
      <div class="column justify-center">
        <div class="text-weight-bolder" id="playlist-title">
          {{ playlist?.name }}
        </div>
        <div class="text-grey-8" id="playlist-description">
          {{ playlist?.description }}
        </div>
        <div class="text-grey-5 q-mt-lg" id="playlist-info">
          {{ playlist?.tracks.total }} Songs
        </div>
      </div>
      <div class="row"></div>
    </div>
    <div class="row q-mb-md q-ml-md q-mr-md">
      <q-btn
        round
        size="lg"
        color="primary"
        icon="note_add"
        class="q-mr-lg"
        @click="openNewDialog = 'bingo'"
      >
        <q-tooltip> Generate Bingo Cards </q-tooltip>
      </q-btn>
      <q-btn
        flat
        size="lg"
        round
        color="primary"
        icon="playlist_add"
        @click="openNewDialog = 'playlist'"
      >
        <q-tooltip> Make sub playlist </q-tooltip>
      </q-btn>
      <q-btn flat size="lg" round icon="more_horiz">
        <!-- <q-tooltip>More Actions</q-tooltip> -->
        <q-menu auto-close>
          <q-list>
            <q-item clickable @click="rename()">
              <q-item-section avatar>
                <q-icon name="edit"></q-icon>
              </q-item-section>
              <q-item-section>Rename Playlist</q-item-section>
            </q-item>
            <!-- <q-item clickable>
                  <q-item-section avatar>
                    <q-icon name="preview"></q-icon>
                  </q-item-section>
                  <q-item-section>View</q-item-section>
                </q-item> -->
            <q-item clickable @click="deletePlaylist()">
              <q-item-section avatar>
                <q-icon name="delete"></q-icon>
              </q-item-section>
              <q-item-section>Delete Subplaylist</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
    <SongList :songs="tracks" :mini="false"></SongList>
  </div>

  <GeneratorDialog
    :dialog_mode="openNewDialog"
    :playlist="playlist?.id"
  ></GeneratorDialog>
</template>
