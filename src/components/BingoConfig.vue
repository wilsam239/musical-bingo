<script setup lang="ts">
import { BingoService } from '@/bingo.service';
import router from '@/router';
import { SpotifyService } from '@/spotify.service';
import { ref } from 'vue';

const playlistURL = ref("")
const ss = SpotifyService
const bs = BingoService



function extractPlaylistId(url: string): string | null {
  const regex = /playlist\/([a-zA-Z0-9]+)\?/;
  const match = url.match(regex);
  if (match && match.length >= 2) {
    return match[1];
  }
  return null;
}

function fetch() {
  //https://open.spotify.com/playlist/37i9dQZEVXbJPcfkRz0wJ0?si=1b8f620a38744e5c

  const id = extractPlaylistId(playlistURL.value)

  if (id) {
    ss.fetchPlaylist(id).subscribe((songs) => {
      bs.populate(songs);
      router.push('/bingo')
    })
  } else {
    console.error('Yeah nah, no id ')
  }
}

</script>

<template>
  <h2>Bingo Config</h2>
    <form>
      <div class="user-box">
        <input type="text" name="" v-model="playlistURL" required>
        <label>Playlit URL</label>
      </div>
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
</template>