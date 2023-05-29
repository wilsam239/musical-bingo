<script setup lang="ts">
import router from '@/router';
import { SpotifyService } from '@/services/spotify.service';
import { onMounted, ref, watch } from 'vue';

const clientID = ref('id')
const ss = SpotifyService

let code
let loading = ref(true);
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  code = params.get('code')

  if (code) {
    ss.loginWithCode(code).subscribe(() => {
      router.push('/config')
    })
  } else {
    loading.value = false
  }

  clientID.value = ss.clientID
  // clientSecret.value = ss.clientSecret
  if (ss.isLoggedIn) {
    console.log('Still logged in')
    router.push('/config')
  }
})

watch(clientID, (val) => {
  ss.clientID = val
})

</script>

<template>
  <div class="config-pages">
    <div class="login-box">
      <div v-if="!loading">
        <h2>Login</h2>
        <form>
          <div class="user-box">
            <input type="text" name="" v-model="clientID" required />
            <label>Client ID</label>
          </div>
          <!-- <div class="user-box">
              <input type="password" v-model="clientSecret" required />
              <label>Client Secret</label>
            </div> -->
          <a @click="ss.loginNoCode()">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Login
          </a>
        </form>
      </div>
      <div v-else>
        <div class="loading"></div>
      </div>
    </div>
  </div>
</template>
<style></style>
