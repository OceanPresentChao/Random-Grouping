<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import { people } from '../utils/people'
import { ANSIX, hmac, linearMod, uniDirectHash } from '../utils/algorithm'
type RandomAlgorithm = 'LinearMod' | 'UniDirectHash' | 'Hmac' | 'ANSI'
const algorithmSelections = ['LinearMod', 'UniDirectHash', 'Hmac', 'ANSI']
const algorithm = ref<RandomAlgorithm>('LinearMod')
const origin = ref(people)
const groupSize = ref(6)
const isHandled = ref(false)
const cache: Array<typeof origin.value> = []
const group = computed(() => {
  const result = []
  const groupNum = Math.ceil(origin.value.length / groupSize.value)
  let tmp = []
  for (let i = 0; i < origin.value.length; i++) {
    tmp.push(origin.value[i])
    if ((i + 1) % groupSize.value === 0 || i === origin.value.length - 1) {
      result.push(tmp.concat())
      tmp = []
    }
  }
  return result
})

function shuffleArray<T, U>(
  arr: Array<T>,
  generator: Generator<U, void, unknown>,
): Array<T> {
  const result = arr.concat().map(v => ({ val: v, index: generator.next().value as U }))
  result.sort((a, b) => {
    return a.index > b.index ? 1 : -1
  })
  return result.map(v => v.val)
}

function randomGroup(algorithm: RandomAlgorithm) {
  if (!isHandled.value)
    isHandled.value = true
  if (algorithm === 'LinearMod')
    origin.value = shuffleArray(origin.value, linearMod())
  if (algorithm === 'UniDirectHash')
    origin.value = shuffleArray(origin.value, uniDirectHash())
  if (algorithm === 'Hmac')
    origin.value = shuffleArray(origin.value, hmac())
  if (algorithm === 'ANSI')
    origin.value = shuffleArray(origin.value, ANSIX())
  for (let i = 0; i < origin.value.length; i++)
    origin.value[i].group = Math.ceil((i + 1) / groupSize.value)
  cache.push(origin.value.concat())
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
        <span v-for="(p, n) in v" :key="n" style="padding:1em;">{{ p.name }}</span>
      </div>
      <div>
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
