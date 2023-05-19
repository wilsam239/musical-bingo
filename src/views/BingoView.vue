<script setup lang="ts">
import { BingoService } from '@/bingo.service'
import BingoTable from '@/components/BingoTable.vue'
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'

const iterations: Ref<number[]> = ref([])
const bingo = BingoService
onMounted(() => {
  for (let i = 0; i < bingo.numberOfSheets; i++) {
    iterations.value.push(i)
  }
})
</script>

<template>
  <div class="page">
    <div class="subpage">
      <h1>Setup</h1>
      <ul>
        <li>Print all of the following sheets.</li>
        <li>
          Announce over the microphone that anyone wishing to play musical bingo can receive a sheet
          with any qualifying purchase at the bar of food or drinks.
        </li>
        <li v-if="bingo.hasTooManySongs">
          For this particular playlist, there are too many songs in the playlist, this means you
          must play it in order without shuffling, from the first song in the list.
          <br />
          The winning card order for this one is:
          <div>
            <div v-for="(place, index) of bingo.winners" :key="place">
              {{ index + 1 }}
              <ul>
                <li v-for="page of place" :key="page">
                  {{ page }}
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="page" v-for="i in iterations" :key="i">
    <div class="subpage">
      <header>
        <div class="logo flex-items">
          <svg
            class="logo-full"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 95 71"
          >
            <title>The Welders Dog</title>
            <path class="cls-1" d="M5.34,58.16v1.75H3.68v10.5H1.91V59.91H.26V58.16Z"></path>
            <path
              class="cls-1"
              d="M6.46,58.16H8.23v5.25H9.77V58.16h1.77V70.41H9.77V65.16H8.23v5.25H6.46Z"
            ></path>
            <path
              class="cls-1"
              d="M13.16,58.16h4.58v1.75H14.93v3.5h2.42v1.75H14.93v3.51h2.81v1.74H13.16Z"
            ></path>
            <path
              class="cls-1"
              d="M29,67.6l1.24-9.44H32l-.57,4.35-1.25,7.9H27.74l-.92-6.32-.91,6.32H23.49L22.24,62.5l-.58-4.34h1.78l1.25,9.44,1.25-9.44H27.7Z"
            ></path>
            <path
              class="cls-1"
              d="M33,58.16h4.58v1.75H34.81v3.5h2.42v1.75H34.81v3.51h2.81v1.74H33Z"
            ></path>
            <path class="cls-1" d="M38.94,70.41V58.16H40.7V68.67h2.82v1.74Z"></path>
            <path
              class="cls-1"
              d="M44.58,58.16H47.3c1.57,0,2.36.87,2.36,2.58v7.1c0,1.71-.82,2.57-2.47,2.57H44.58Zm1.77,1.75v8.76h.77c.51,0,.77-.27.77-.83v-7.1c0-.56-.26-.83-.77-.83Z"
            ></path>
            <path
              class="cls-1"
              d="M51.16,58.16h4.58v1.75H52.92v3.5h2.43v1.75H52.92v3.51h2.82v1.74H51.16Z"
            ></path>
            <path
              class="cls-1"
              d="M57.05,58.16h2.57c1.57,0,2.36.87,2.36,2.58v1.84a2.05,2.05,0,0,1-1.39,2.13l2,5.7H60.64L59,65l-.22,0v5.35H57.05Zm1.77,1.75v3.5h.4a1.51,1.51,0,0,0,.51,0,.74.74,0,0,0,.48-.78V60.74c0-.56-.26-.83-.77-.83Z"
            ></path>
            <path
              class="cls-1"
              d="M66.62,60.54a2.54,2.54,0,1,1,5.07,0v1.65H69.93V60.54c0-.55-.26-.82-.77-.83h0c-.51,0-.77.28-.77.83v1.11c0,.55.56,1.22,1.66,2a3.43,3.43,0,0,1,1.65,2.83V68a2.54,2.54,0,1,1-5.07,0V66.39h1.76V68c0,.55.26.83.78.83s.77-.28.77-.83v-1.4c0-.59-.55-1.29-1.66-2.08a3.44,3.44,0,0,1-1.65-2.87Z"
            ></path>
            <path
              class="cls-1"
              d="M76.36,58.16h2.73c1.57,0,2.35.87,2.35,2.58v7.1c0,1.71-.82,2.57-2.46,2.57H76.36Zm1.77,1.75v8.76h.78c.51,0,.76-.27.76-.83v-7.1c0-.56-.25-.83-.76-.83Z"
            ></path>
            <path
              class="cls-1"
              d="M87.89,68a2.54,2.54,0,1,1-5.07,0v-7.5a2.54,2.54,0,1,1,5.07,0Zm-1.77-7.5c0-.55-.25-.82-.76-.83h0c-.5,0-.76.28-.76.83V68c0,.55.26.83.77.83s.77-.28.77-.83Z"
            ></path>
            <path
              class="cls-1"
              d="M94.34,68a2.54,2.54,0,1,1-5.07,0v-7.5a2.54,2.54,0,1,1,5.07,0v1.65H92.58V60.54c0-.55-.26-.82-.77-.83h0c-.5,0-.76.28-.76.83V68c0,.55.26.83.77.83s.78-.28.78-.83V65.16h-.9V63.41h2.66Z"
            ></path>
            <path
              class="cls-1"
              d="M64.4,60.38a.86.86,0,0,0,.28,0,.76.76,0,0,1-.6.53.48.48,0,0,0-.17.05c-.12.08-.07.3.07.37a.57.57,0,0,0,.44,0,1.71,1.71,0,0,0,.89-2.5,1.08,1.08,0,0,0-2,.59A1,1,0,0,0,64.4,60.38Z"
            ></path>
            <path
              class="cls-1"
              d="M67.23.76a1.24,1.24,0,0,1,.25.45c.43,1.26-.12,2.82.45,4S70,6.42,70.63,7.51c.21.37.24.81.45,1.17.43.73,1.41.87,2.24,1s1.82.51,2,1.35a1.52,1.52,0,0,1-.71,1.42,5.51,5.51,0,0,1-2,.69,7.43,7.43,0,0,0,1.16.51c1.79.84-.38,2.18-1.43,2.25-2,.14-2.26-1-3.84.25-1,.78-2,2-1.92,3.31.08.8.4,1.55.56,2.34.38,2-.36,4.07-.43,6.12a17.74,17.74,0,0,1-.09,2.63,19,19,0,0,1-1.26,3.25,18,18,0,0,0-.91,4.37l-.69,5.47c-.21,1.61.25,2.69.25,4.17.12.4.08.82.2,1.23a4.31,4.31,0,0,1,.37,1.17c0,.16.16.11.26.12.36,0,.73,0,1.09,0,2.27.14,4.54.07,6.8.2,1.89.1,3.78,0,5.66.15s3.87,0,5.79.17c1.48.11,3,.06,4.43.22H5.81V51a2.4,2.4,0,0,1,.28,0c1.13,0,2.27,0,3.4-.08,2-.16,3.92,0,5.87-.16s3.81,0,5.71-.17,3.78-.05,5.66-.15a5.35,5.35,0,0,0,.68-.11.19.19,0,0,0,.16-.15l.51-1.33c.72-1.89.13-3.91.75-5.8a16.11,16.11,0,0,1,1.32-2.45c1.25-2.37,1.14-5.2,1.15-7.88s.25-5.58,2-7.62c1.3-1.52-1.64-.86-2.39-.79-1,.08-2.47.47-3.38,0a3.92,3.92,0,0,1-1.83-3.73c0-.82,1.44-6.43,3-4.86a1,1,0,0,1,.19,1c-.08.34-.25.65-.35,1a3.1,3.1,0,0,0,2.18,3.5,7,7,0,0,0,4.45-.31,25.58,25.58,0,0,1,9-1.68c3.4.07,7.05.88,10-.79a11.2,11.2,0,0,0,3.93-4.5c.94-1.61,2.42-3.39,2.73-5.23A29,29,0,0,0,61,5.32a15.91,15.91,0,0,1,.51-3.21.65.65,0,0,1,.34-.5.64.64,0,0,1,.46.08A3.8,3.8,0,0,1,64.26,4a.56.56,0,0,0,.38.44,6.77,6.77,0,0,0,1.25-2.78,2.25,2.25,0,0,1,.43-.79A.69.69,0,0,1,67.15.7.24.24,0,0,1,67.23.76ZM47.48,33.94c-.23.76-.46,1.51-.73,2.26A13.23,13.23,0,0,1,44,40.93a4.76,4.76,0,0,0-1.12,3.5,14,14,0,0,0,.29,2.87,2.59,2.59,0,0,0,.71,1.37,2.58,2.58,0,0,1,.72.87.45.45,0,0,0,.5.33c2,0,4-.06,6,.1,1.07.08,2.16,0,3.24.05.23,0,.4,0,.27-.33a1.14,1.14,0,0,1,0-.63,4,4,0,0,0,.19-1.54,14.49,14.49,0,0,1-.42-3.7c0-1.08,0-2.16,0-3.24a2.52,2.52,0,0,0-.05-.48c-.14-.56-.31-1.1-.42-1.66a10.54,10.54,0,0,1-.33-2c0-.15-.1-.18-.22-.24-1.3-.64-2.61-1.26-3.88-1.94C48.41,33.7,47.55,33.74,47.48,33.94ZM31.65,50.29c.47,0,.94-.06,1.4-.08,1.91-.1,3.83,0,5.74-.16a19.79,19.79,0,0,1,2.31,0c.34,0,.48-.1.42-.44a9.29,9.29,0,0,0-.48-2,20.93,20.93,0,0,0-1.14-2.77A6.15,6.15,0,0,1,39.3,43a.42.42,0,0,1,.05-.34c.18-.32.35-.65.52-1a5.42,5.42,0,0,0,1-3.23,13.18,13.18,0,0,1-.08-1.78,1.13,1.13,0,0,0-.3-.9,6.76,6.76,0,0,1-.57-.8,9.26,9.26,0,0,0-1.58-1.73c-.17-.15-.26-.18-.38.06s-.42.63-.62.95c-.66,1.06-1.22,2.17-1.95,3.18a23.88,23.88,0,0,0-1.93,2.86,26.3,26.3,0,0,0-1.75,3.77A11.69,11.69,0,0,0,31.1,46c0,.29-.13.6-.2.89-.19.75-.68,1.45-.43,2.29.1.34-.07.87.13,1S31.29,50.29,31.65,50.29ZM61.56,33.86a4.83,4.83,0,0,1-1.35,1.79c-.68.57-1.71.62-2.16,1.47A7.25,7.25,0,0,0,57.31,40a29.23,29.23,0,0,0-.2,3.63,3.89,3.89,0,0,0,.26,1.12,3.16,3.16,0,0,1,.14,1.65,3,3,0,0,0,.09,2,1.13,1.13,0,0,1,.16,1.11c-.17.36,0,.65.3.66l3.16,0c.09,0,.23,0,.25-.08.06-.34.28-.67.15-1a4.2,4.2,0,0,1-.29-1.6.27.27,0,0,0-.1-.29c-.37-.26-.26-.63-.15-.94a2.36,2.36,0,0,0,.15-1.06,17.24,17.24,0,0,1,0-2.59,13.67,13.67,0,0,0-.27-2.39,8.27,8.27,0,0,1,0-2.33c.12-1-.17-2,.29-3A2.11,2.11,0,0,0,61.56,33.86Z"
            ></path>
          </svg>
        </div>
        <h1 class="flex-items">MUSICAL BINGO</h1>
        <h2 v-if="bingo.subtitle">{{ bingo.subtitle }}</h2>
      </header>
      <BingoTable :index="i"></BingoTable>
      <footer>Page {{ i + 1 }}/{{ bingo.numberOfSheets }}</footer>
    </div>
  </div>
</template>

<style>
header {
  text-align: center;
}
footer {
  margin-top: 1em;
  text-align: right;
}
/* header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: normal;
  align-items: normal;
  align-content: normal;
}

.flex-items:nth-child(1) {
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

.flex-items:nth-child(2) {
  display: block;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

.flex-items:nth-child(3) {
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}*/
.logo-full {
  height: 100px;
}
.page {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 10mm auto;
  border: 1px #d3d3d3 solid;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.subpage {
  padding: 1cm;
  /* border: 5px red solid; */
  /* height: 257mm; */
  /* outline: 2cm #ffeaea solid; */
}

@page {
  size: A4;
  margin: 0;
}
@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
  }
  .page {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}
.cls-1 {
  fill: #040000;
}
/* body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: none;
} */
</style>
