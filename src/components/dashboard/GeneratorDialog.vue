<script setup lang="ts">
import { useTemplateRefsList } from '@vueuse/core';
import { QDialog, QStepper } from 'quasar';
import { generate, mergeMap, tap } from 'rxjs';
import { SpotifyService } from 'src/services/spotify.service';
import { BingoService } from 'src/services/bingo.service';

import { Ref, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { SnackbarService } from 'src/services/snackbar.service';

const props = defineProps<{ dialog_mode: TMode; playlist?: string }>();

type TMode = 'playlist' | 'bingo' | 'both' | undefined;

const showDialog = ref(false);
const mode: Ref<TMode> = ref('playlist');
const showBoth = ref(false);

const generateBingo = ref(false);

const router = useRouter();

// Playlist Config
const url = ref('');
const name = ref('Musical Bingo - ' + new Date().toLocaleDateString());
const songCount = ref(50);

// Bingo Config
const subtitle = ref('');
const sheetCount = ref(20);

// Refs
const stepper: Ref<QStepper | null> = ref(null);
const dialog: Ref<QDialog | null> = ref(null);

watch(
  () => props.dialog_mode,
  (dm: TMode) => {
    showDialog.value = dm !== undefined;
    if (dm === 'both') {
      showBoth.value = true;
      mode.value = 'playlist';
    } else {
      showBoth.value = false;
      mode.value = dm;
    }
  }
);

watch(
  () => props.playlist,
  (id) => {
    if (id) {
      url.value = 'https://https://open.spotify.com/playlist/' + id;
    } else {
      url.value = '';
    }
  }
);

function extractPlaylistId(url: string): string | null {
  const regex = /\/playlist\/([^/?]+)/;
  const match = url.match(regex);
  if (match && match.length >= 2) {
    return match[1];
  }
  return null;
}

function playlistSubmit() {
  if (generateBingo.value && stepper.value) {
    stepper.value.next();
    mode.value = 'both';
  } else {
    if (!url.value) {
      console.error('No url, so no playlist can be created');
      return;
    }

    const id = extractPlaylistId(url.value);

    if (!id) {
      console.error('Failed to get id from the playlist url', url.value);
      return;
    }

    SpotifyService.fetchPlaylist(id, {
      makeSubPlaylist: true,
      playlistSize: songCount.value,
    }).subscribe(() => {
      SnackbarService.msgSuccess(
        'Playlist Created!',
        `Successfully created a playlist with ${songCount.value} songs`
      );
      dialog.value?.hide();
    });
  }
}

function bingoSubmit() {
  if (!url.value) {
    console.error('No url, so no bingo can be created');
    return;
  }
  const id = extractPlaylistId(url.value);

  if (!id) {
    console.error('Failed to get id from the playlist url', url.value);
    return;
  }
  SpotifyService.fetchPlaylist(id)
    .pipe(
      mergeMap((playlist) => {
        return SpotifyService.fetchPlaylistTracks(playlist).pipe(
          tap((songs) => {
            BingoService.numberOfSheets = sheetCount.value;
            BingoService.subtitle = subtitle.value;
            BingoService.generate(playlist, songs);
            router.push('/bingo');
          })
        );
      })
    )
    .subscribe();
  dialog.value?.hide();
  console.log('Done! Now create bingo cards from this playlist');
}

function reset() {
  showDialog.value = false;
  mode.value = 'playlist';
  showBoth.value = false;
  generateBingo.value = false;
  url.value = '';
  name.value = 'Musical Bingo - ' + new Date().toLocaleDateString();
  songCount.value = 50;
  subtitle.value = '';
  sheetCount.value = 20;

  console.info('Dialog reset!');
}
</script>
<template>
  <q-dialog v-model="showDialog" @hide="reset()" ref="dialog">
    <q-card>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>

        <q-toolbar-title>Configure New Playlist </q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-stepper v-model="mode" ref="stepper" color="primary" animated>
          <q-step
            v-if="dialog_mode == 'playlist' || dialog_mode == 'both'"
            :name="'playlist'"
            title="Configure Playlist"
            icon="settings"
            :done="false"
          >
            <q-form @submit="playlistSubmit" class="q-gutter-md">
              <div class="spaced-inputs">
                <q-input
                  square
                  outlined
                  v-if="!playlist"
                  v-model="url"
                  type="text"
                  label="Playlist URL"
                />
                <q-input
                  square
                  outlined
                  v-model="name"
                  type="text"
                  label="Playlist Name"
                ></q-input>
                <q-input
                  square
                  outlined
                  v-model="songCount"
                  type="number"
                  label="Number Of Songs To Use"
                />
                <q-toggle
                  v-model="generateBingo"
                  color="green"
                  label="Generate Bingo Cards"
                />
                <q-btn
                  :label="generateBingo ? 'Next' : 'Generate!'"
                  type="submit"
                  color="primary"
                />
              </div>
            </q-form>
          </q-step>
          <q-step
            v-if="mode == 'bingo' || mode == 'both'"
            :name="'bingo'"
            title="Configure Bingo"
            icon="create_new_folder"
            :done="false"
          >
            <q-form @submit="bingoSubmit" class="q-gutter-md">
              <div class="spaced-inputs">
                <q-input
                  square
                  outlined
                  v-model="subtitle"
                  type="text"
                  label="Subtitle eg sponsor, theme, etc"
                ></q-input>
                <q-input
                  square
                  outlined
                  v-model="sheetCount"
                  type="number"
                  label="Number Of Sheets"
                />
                <q-btn label="Generate!" type="submit" color="primary" />
              </div>
            </q-form>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
