<script setup lang="ts">
import { BingoService } from '@/services/bingo.service';
import { SnackbarService } from '@/services/snackbar.service';
import { SpotifyService } from '@/services/spotify.service';
import { onMounted, ref } from 'vue';

const skipTime = ref(
  ""
)

const playedSongs: Set<string> = new Set()
const currentSong = ref("");
const ss = SpotifyService
const bs = BingoService
const snack = SnackbarService
let loading = ref(false);

let skipInterval: number;

onMounted(() => {
  getCurrentSong();
  setInterval(() => {
    getCurrentSong();
  }, 5000)
})

function getCurrentSong() {
  ss.fetchPlaybackState().subscribe((resp: SpotifyApi.CurrentPlaybackResponse): void => {
    if (resp && resp.item && resp.item.type == "track") {
      currentSong.value = `${resp.item.name} - ${resp.item.artists.map(a => a.name).join(', ')}`;
      playedSongs.add(currentSong.value);
    }
  })
}

function skipUpdate() {

  const timer = parseInt(skipTime.value);
  if(isNaN(timer) || timer <= 5) {
    console.error('Not a valid time');
    return;
  }

  if(skipInterval !== undefined) {
  clearInterval(skipInterval);
  }

  skipInterval = setInterval(() => {
    if(currentSong.value) {
    console.log("skipping!")
    ss.nextTrack().subscribe()
    } else {
      console.log("No current song")
    }
  }, timer * 1000)

  snack.msgSuccess("Timer updated!", "")
}

function logSongs() {
  console.log(playedSongs)
}
</script>

<template>
  <div class="config-pages">
    <div class="login-box">
      <div v-if="!loading">
        <div class="row">
          <div class="column-1">
            <a id="back-button" href="/musical-bingo/" @click="ss.clearSession()">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              ⏎
            </a>
          </div>
          <div class="column-2">
            <h2>Bingo Run</h2>
          </div>
        </div>
        <form>
          <div class="user-box">
            <input type="text" name="" v-model="skipTime" />
            <label>Time Before Skipping</label>
          </div>
          <div class="user-box">
            {{currentSong}}
          </div>
          <a @click="skipUpdate()">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
              Update Skip Timer
          </a>
          <a @click="logSongs()">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
                View Played Songs
            </a>
        </form>
      </div>
      <div v-else>
        <div class="loading"></div>
      </div>
    </div>
  </div>
</template>
<style>
/* Clear floats after the columns */
.row {
  display: flex;
  flex-direction: row;
  margin-bottom: 2em;
}

#back-button {
  margin-top: 0;
}

.login-box h2 {
  margin: 0;
}

.column-2 {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
