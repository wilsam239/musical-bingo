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
  <div class="page" v-for="i in iterations" :key="i">
    <div class="subpage">
      <BingoTable :index="i"></BingoTable>
    </div>
  </div>
</template>

<style>
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
  border: 5px red solid;
  /* height: 257mm; */
  outline: 2cm #ffeaea solid;
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
/* body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: none;
} */
</style>
