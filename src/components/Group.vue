<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import { type People, people } from '../utils/people'
import { ANSIX, combinedCrypto, hmac, linearMod, uniDirectHash } from '../utils/algorithm'
type RandomAlgorithm = 'LinearMod' | 'UniDirectHash' | 'Hmac' | 'ANSI' | 'CombinedCrypto'
const algorithmSelections: Array<RandomAlgorithm> = ['LinearMod', 'UniDirectHash', 'Hmac', 'ANSI', 'CombinedCrypto']
const algorithm = ref<RandomAlgorithm>('LinearMod')
const origin = ref(people)
const randomTimes = ref(1)
const groupSize = ref(6)
const isHandled = ref(false)
let cache: Array<typeof origin.value> = []
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

const map = initGenerators()

watch(algorithm, (v, ov) => {
  cache = []
  isHandled.value = false
})

function initGenerators() {
  const map = new Map<RandomAlgorithm, Generator<string, void, unknown>>()
  map.set('ANSI', ANSIX())
  map.set('LinearMod', linearMod())
  map.set('Hmac', hmac())
  map.set('UniDirectHash', uniDirectHash())
  map.set('CombinedCrypto', combinedCrypto())
  return map
}

function shuffleArray(
  arr: People[],
  generator: Generator<string, void, unknown>,
) {
  const result = arr
  result.forEach(v => v.randomString = generator.next().value!)
  result.sort((a, b) => {
    return a.randomString > b.randomString ? 1 : -1
  })
  return result
}

function randomGroup(algorithm: RandomAlgorithm) {
  if (!isHandled.value)
    isHandled.value = true
  if (randomTimes.value < 1)
    randomTimes.value = 1
  randomTimes.value = Math.ceil(randomTimes.value)
  for (let c = 0; c < randomTimes.value; c++) {
    origin.value = shuffleArray(origin.value, map.get(algorithm)!)
    for (let i = 0; i < origin.value.length; i++)
      origin.value[i].group = Math.ceil((i + 1) / groupSize.value)
    cache.push(JSON.parse(JSON.stringify(origin.value)))
  }
}

function outPutCache() {
  writeTextFile('output.json', JSON.stringify(cache), { dir: BaseDirectory.Desktop })
}
</script>

<template>
  <div class="container">
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
        <button :disabled="!isHandled" @click="outPutCache()">
          Output
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
