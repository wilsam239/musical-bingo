<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core';
import { SpotifyService } from '../services/spotify.service';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const clientID = ref('id');
const ss = SpotifyService;
const router = useRouter();

let code;
let loading = ref(true);
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  code = params.get('code');

  if (code) {
    ss.loginWithCode(code).subscribe(() => {
      router.push('/dashboard');
    });
  } else {
    loading.value = false;
  }

  clientID.value = ss.clientID;
  // clientSecret.value = ss.clientSecret
  if (ss.isLoggedIn) {
    console.log('Still logged in');
    router.push('/dashboard');
  }
});

watch(clientID, (val) => {
  ss.clientID = val;
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-card
        flat
        bordered
        class="my-card"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
      >
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">Spotify App Client ID</div>
              <!-- <div class="text-subtitle2">by John Doe</div> -->
            </div>

            <!-- <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section>Remove Card</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Send Feedback</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Share</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div> -->
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            square
            outlined
            v-model="clientID"
            label="Spotify Web App Client ID"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat @click="ss.loginNoCode()" :disable="!clientID"
            >Login</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-page-container>
  </q-layout>
</template>
