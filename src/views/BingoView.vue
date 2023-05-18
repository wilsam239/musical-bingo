<script setup lang="ts">
import { BingoService } from '@/bingo.service';
import { onMounted } from 'vue';

const iterations:number[] = []
const bingo = BingoService
onMounted(() => {
  for(let i = 0; i < 25; i++) {
    iterations.push(i)
  }
  console.log(iterations)
})
</script>

<template>
  <p v-for="i in iterations" :key="i">
  {{ bingo.shuffle }}
  </p>
</template>



<style>

</style>
