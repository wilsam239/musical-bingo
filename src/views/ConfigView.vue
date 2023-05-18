<script setup lang="ts">
import { SpotifyService } from '@/spotify.service';
import { onMounted, ref } from 'vue';

const clientID= ref("id")
const clientSecret = ref("secret")
const playlistURL = ref("")
const ss = SpotifyService

onMounted(() => {
  clientID.value = ss.clientID
  clientSecret.value = ss.clientSecret
})

function extractPlaylistId(url: string): string | null {
  const regex = /playlist\/([a-zA-Z0-9]+)\?/;
  const match = url.match(regex);
  if (match && match.length >= 2) {
    return match[1];
  }
  return null;
}

function login() {
  ss.login(clientID.value, clientSecret.value).subscribe()
}

function fetch() {
  //https://open.spotify.com/playlist/37i9dQZEVXbJPcfkRz0wJ0?si=1b8f620a38744e5c

  const id = extractPlaylistId(playlistURL.value)

  if(id) {
  ss.fetchPlaylist(id).subscribe()
  } else {
    console.error('Yeah nah, no id ')
  }
}

</script>

<template>
  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi voluptatum illo repellat suscipit ex. Repudiandae pariatur quibusdam quidem inventore aperiam asperiores, odio repellendus reprehenderit et? Quibusdam ex eius placeat cumque.</p>
  <main>
    <input v-model="clientID">
      <input v-model="clientSecret">
      <button v-on:click="login()">GO!</button>
      <br>
      
    <input v-model="playlistURL">
        <button v-on:click="fetch()">Get!</button>
      
  </main>
</template>
