<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import { type People, people, peopleNames } from '../utils/people'
import { ANSIX, combinedCrypto, hmac, linearMod, uniDirectHash } from '../utils/algorithm'
import Menu from './Menu.vue'
type RandomAlgorithm = 'LinearMod' | 'UniDirectHash' | 'Hmac' | 'ANSI' | 'CombinedCrypto'
const algorithmSelections: Array<RandomAlgorithm> = ['LinearMod', 'UniDirectHash', 'Hmac', 'ANSI', 'CombinedCrypto']
const algorithm = ref<RandomAlgorithm>('LinearMod')
const origin = ref(people)
const randomTimes = ref(1)
const groupSize = ref(6)
const shuffleNum = ref(0)
let cache: Array<typeof origin.value> = []
const genMap = initGenerators()
const statisMap = initStatisMap()
const menuVis = ref(false)
const group = computed(() => {
  const result = []
  const groupNum = Math.ceil(origin.value.length / groupSize.value)
  let tmp = []
  for (let i = 0; i < origin.value.length; i++) {
    tmp.push(origin.value[i].name)
    if ((i + 1) % groupSize.value === 0 || i === origin.value.length - 1) {
      result.push(tmp.concat())
      tmp = []
    }
  }
  return result
})

watch(algorithm, (v, ov) => {
  cache = []
  shuffleNum.value = 0
  statisMap.clear()
})

provide('statisMap', statisMap)

function initGenerators() {
  const map = new Map<RandomAlgorithm, Generator<string, void, unknown>>()
  map.set('ANSI', ANSIX())
  map.set('LinearMod', linearMod())
  map.set('Hmac', hmac())
  map.set('UniDirectHash', uniDirectHash())
  map.set('CombinedCrypto', combinedCrypto())
  return map
}

function initStatisMap() {
  const map = new Map<string, Map<number, number>>()
  peopleNames.forEach((v) => {
    map.set(v, new Map<number, number>())
  })
  return map
}

function collectGroupInfo(arr: People[]) {
  arr.forEach((v) => {
    const gmap = statisMap.get(v.name)
    if (gmap) {
      const num = gmap.get(v.group)
      if (num)
        gmap.set(v.group, num + 1)
      else
        gmap.set(v.group, 1)
    }
  })
}

function shuffleArray(
  arr: People[],
  generator: Generator<string, void, unknown>,
) {
  const result = arr
  result.forEach(v => v.random = generator.next().value!)
  result.sort((a, b) => {
    return a.random > b.random ? 1 : -1
  })
  return result
}

function randomGroup(algorithm: RandomAlgorithm) {
  if (randomTimes.value < 1)
    randomTimes.value = 1
  randomTimes.value = Math.ceil(randomTimes.value)
  for (let c = 0; c < randomTimes.value; c++) {
    origin.value = shuffleArray(origin.value, genMap.get(algorithm)!)
    for (let i = 0; i < origin.value.length; i++)
      origin.value[i].group = Math.ceil((i + 1) / groupSize.value)
    collectGroupInfo(origin.value)
    cache.push(JSON.parse(JSON.stringify(origin.value)))
  }
  shuffleNum.value += randomTimes.value
}

function outPutCache() {
  writeTextFile('output.json', JSON.stringify(cache), { dir: BaseDirectory.Desktop })
}

function setMenuVis(flag: boolean) {
  menuVis.value = flag
}
</script>

<template>
  <div class="container">
    <Transition>
      <Menu v-if="menuVis" :shuffle-num="shuffleNum" @set-vis="setMenuVis" />
    </Transition>
    <div style="margin-left: auto;cursor: pointer;" @click="setMenuVis(true)">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>
    </div>
    <div>
      <p style="font-size: large; font-weight: 600">
        Random Grouping Tool
      </p>
      <div>
        <span>Algorithm: </span>
        <select v-model="algorithm" name="algorithm">
          <option v-for="(val) in algorithmSelections" :key="val" :value="val">
            {{ val }}
          </option>
        </select>
        <span style="padding: 1em;" />
        <label>GroupSize: </label>
        <input v-model="groupSize" type="text">
      </div>
    </div>
    <div>
      <div v-for="(v, i) in group" :key="i">
        <span>Group{{ i + 1 }}:</span>
        <span v-for="(p, n) in v" :key="n" style="padding:1em;">{{ p }}</span>
      </div>
      <div style="margin-top: 1rem;">
        <label>Times: </label>
        <input v-model="randomTimes" type="number" :min="1" step="1" style="width: 4rem;">
        <span style="padding: 0.25em;" />
        <button @click="randomGroup(algorithm)">
          Random
        </button>
        <span style="padding: 1em;" />
        <button :disabled="shuffleNum <= 0" @click="outPutCache()">
          Output
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity .5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
