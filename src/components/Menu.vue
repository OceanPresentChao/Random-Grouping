<script setup lang="ts">
import { ref } from 'vue'
import { peopleNames } from '../utils/people'
import Statistics from './Statistics.vue'
const props = defineProps({
  shuffleNum: Number,
})
const emits = defineEmits(['setVis'])
const statisVis = ref(false)
const statisPer = ref('')
function showPersonalStatis(name: string) {
  statisVis.value = true
  statisPer.value = name
}
</script>

<template>
  <div class="backdrop">
    <div style="cursor:pointer;" @click="$emit('setVis', false)">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M20 20L4 4m16 0L4 20" /></svg>
    </div>
    <div>
      <div>
        Total Shuffle Num: {{ shuffleNum }}
      </div>
      <div v-if="!statisVis" class="p-container">
        <button v-for="p in peopleNames" :key="p" @click="showPersonalStatis(p)">
          {{ p }}
        </button>
      </div>
      <Statistics v-if="statisVis" :person="statisPer" />
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
}

.p-container{
  display: grid;
  grid-template: repeat(6,1fr)/repeat(3,1fr);
  row-gap: 0.5em;
  column-gap: 0.5em;
  padding: 0 5rem;
  margin-top: 2rem;
}
</style>
