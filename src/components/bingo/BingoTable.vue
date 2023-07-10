<script setup lang="ts">
import { BingoService } from '../../services/bingo.service';

const bs = BingoService;
interface BingoTableProps {
  index: number;
}

const props = defineProps<BingoTableProps>();
</script>
<template>
  <div id="content">
    <table id="bingotable">
      <tr v-for="row in bs.fetchTable(index)" :key="JSON.stringify(row)">
        <th v-for="col in row" :key="col">
          {{ col }}
        </th>
      </tr>
    </table>
  </div>
</template>
<style>
#squarefree {
  font-family: Helvetica;
  margin: 0 auto;
  background: #5dc4de;
  text-align: center;
  font-weight: 600;
  font-size: 15pt;
}

#bingotable {
  margin: 0 auto;
  text-align: center;
  width: 400px;
  height: 400px;
  border-collapse: collapse;
  background: white;
}

th,
td {
  font-family: Helvetica;
  margin: 0 auto;
  text-align: center;
  border: 3px solid black;
  min-height: 100px;
  min-width: 100px;
  height: 100px;
  width: 100px;
  font-size: 12px;
}

.orange {
  background: #9b59b6;
}
</style>
