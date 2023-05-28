<script setup lang="ts">
import router from '@/router'
import { BingoService } from '@/services/bingo.service'
import { SpotifyService } from '@/services/spotify.service'
import { ref } from 'vue'

const playlistURL = ref(
  'https://open.spotify.com/playlist/37i9dQZEVXbJPcfkRz0wJ0?si=ae26ffe29ae442a0'
)
const ss = SpotifyService
const bs = BingoService

function extractPlaylistId(url: string): string | null {
  const regex = /playlist\/([a-zA-Z0-9]+)\?/
  const match = url.match(regex)
  if (match && match.length >= 2) {
    return match[1]
  }
  return null
}

function fetch() {
  //https://open.spotify.com/playlist/37i9dQZEVXbJPcfkRz0wJ0?si=1b8f620a38744e5c

  const id = extractPlaylistId(playlistURL.value)

  if (id) {
    ss.fetchPlaylist(id).subscribe((songs) => {
      if (songs.length < bs.rows * bs.cols) {
        console.error('Not enough songs in the playlist')
      } else {
        bs.populate(songs)
        router.push('/bingo')
      }
    })
  }
}
</script>

<template>
  <div class="config-pages">
    <div class="login-box">
      <div class="row">
        <div class="column-1">
          <a id="back-button" href="/login">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            ⏎
          </a>
        </div>
        <div class="column-2">
          <h2>Bingo Config</h2>
        </div>
      </div>
      <form>
        <div class="user-box">
          <input type="text" name="" v-model="playlistURL" required />
          <label>Playlit URL</label>
        </div>
        <div class="user-box">
          <input type="text" name="" v-model="bs.subtitle" required />
          <label>Subtitle (eg: Sponsor, theme)</label>
        </div>
        <div class="user-box">
          <input type="text" name="" v-model="bs.numberOfSheets" required />
          <label>Number Of Sheets</label>
        </div>
        <!-- <div class="user-box">
          <input type="text" name="" v-model="bs.rows" required />
          <label>Bingo Rows</label>
        </div>
        <div class="user-box">
          <input type="text" name="" v-model="bs.cols" required />
          <label>Bingo Columns</label>
        </div> -->
        <!-- <div class="user-box">
        <input type="password" v-model="clientSecret" required>
        <label>Client Secret</label>
      </div> -->
        <a v-on:click="fetch()">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Generate Bingo!
        </a>
      </form>
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
