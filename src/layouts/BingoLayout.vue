<script setup lang="ts">
import BingoTable from '../components/bingo/BingoTable.vue';
import { BingoService } from '../services/bingo.service';
import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';

const iterations: Ref<number[]> = ref([]);
const bingo = BingoService;
onMounted(() => {
  for (let i = 0; i < bingo.numberOfSheets; i++) {
    iterations.value.push(i);
  }
});
</script>

<template>
  <div class="page">
    <div class="subpage">
      <div class="title">Setup</div>
      <p>
        Link to Playlist:
        <a v-bind:href="bingo.playlistURL">{{ bingo.playlistURL }}</a>
      </p>
      <p><b>START OF SCRIPT</b></p>
      <p>
        Welcome to Rouseabout Musical Bingo! We've got X rounds of Bingo
        tonight, but there's no pressure to stay for all of them! The best thing
        about bingo is that you can come in and join at any time, or leave at
        any time! To play bingo all you need to do is make any qualifying
        purchase at the bar, which is any food or beverage.
      </p>
      <p>
        As usual we have prizes up for grabs in each round! 1st prize in each
        round will receive 3 drink tickets, and second place will receive a
        single drink ticket. Limit is one win per table per round, so you cannot
        win both 1st and 2nd prize in the round. Drink tickets are redeemable at
        your next Rouseabout game night, either trivia or bingo!
      </p>
      <p>
        Bingo is played in teams (sometimes), all you have to do is listen out
        for the songs on your sheet, and as you hear them, mark them off. Once
        you have the
        <i>--insert bingo pattern here eg: 5 down, 5 across, or 5 diagonal--</i>
        sing out bingo and come and see us at the bar to verify your win!
      </p>
      <p>After both prizes have been claimed we move on to the next round.</p>
      <p>Tonights menu on the food truck is <i>--read out menu here--</i></p>
      <p>
        We have a few events coming up over the next week,
        <i>--read out events here--</i>
      </p>

      <p><b>END OF SCRIPT</b></p>
      <ul>
        <li>Print all of the following sheets.</li>
        <li>
          Using the bingo site that skips the songs, you can also keep track of
          the songs played using the right hand menu
        </li>
      </ul>
    </div>
  </div>
  <div class="page" v-for="i in iterations" :key="i">
    <div class="subpage">
      <header>
        <div class="logo flex-items">
          <img src="../assets/logo_most_black.png" class="logo-full" />
        </div>
        <div class="flex-items title">MUSICAL BINGO</div>
        <div class="title" v-if="bingo.subtitle">{{ bingo.subtitle }}</div>
      </header>
      <BingoTable :index="i"></BingoTable>
      <footer>Page {{ i + 1 }}/{{ bingo.numberOfSheets }}</footer>
    </div>
  </div>
</template>

<style>
.title {
  font-size: 30px;
  font-weight: bold;
  margin: 1em 0;
}
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
  height: 150px;
}
.page {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 10mm auto;
  border: 1px #d3d3d3 solid;
  border-radius: 5px;
  background: white !important;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  color: black !important;
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
