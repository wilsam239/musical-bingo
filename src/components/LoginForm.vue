<script setup lang="ts">
import router from '@/router'
import { SpotifyService } from '@/spotify.service'
import { onMounted, ref } from 'vue'

const clientID = ref('id')
const clientSecret = ref('secret')
const ss = SpotifyService

onMounted(() => {
  clientID.value = ss.clientID
  clientSecret.value = ss.clientSecret
  if (ss.isLoggedIn) {
    console.log('Still logged in')
    router.push('/config')
  }
})

function login() {
  ss.login(clientID.value, clientSecret.value).subscribe(() => {
    router.push('/config')
  })
}
</script>

<template>
  <div class="config-pages">
    <div class="login-box">
      <h2>Login</h2>
      <form>
        <div class="user-box">
          <input type="text" name="" v-model="clientID" required />
          <label>Client ID</label>
        </div>
        <div class="user-box">
          <input type="password" v-model="clientSecret" required />
          <label>Client Secret</label>
        </div>
        <a v-on:click="login()">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Login
        </a>
      </form>
    </div>
  </div>
</template>
<style></style>
