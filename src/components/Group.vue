<script setup lang="ts">
import { computed, ref } from 'vue'
import { people } from '../utils/people'
import { ANSIX, hmac, linearMod, uniDirectHash } from '../utils/algorithm'
type RandomAlgorithm = 'LinearMod' | 'UniDirectHash' | 'Hmac' | 'ANSI'
const algorithmSelections = ['LinearMod', 'UniDirectHash', 'Hmac', 'ANSI']
const algorithm = ref<RandomAlgorithm>('LinearMod')
const origin = ref(people)
const group = computed(() => {
  const result = []
  for (let i = 0; i < origin.value.length; i += 3)
    result.push([origin.value[i], origin.value[i + 1], origin.value[i + 2]])

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
  if (algorithm === 'LinearMod')
    origin.value = shuffleArray(origin.value, linearMod())
  if (algorithm === 'UniDirectHash')
    origin.value = shuffleArray(origin.value, uniDirectHash())
  if (algorithm === 'Hmac')
    origin.value = shuffleArray(origin.value, hmac())
  if (algorithm === 'ANSI')
    origin.value = shuffleArray(origin.value, ANSIX())
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
      </div>
    </div>
    <div>
      <div v-for="(v, i) in group" :key="i">
        <span>Group{{ i + 1 }}:</span>
        <span v-for="(p, n) in v" :key="n" style="padding:1em;">{{ p.name }}</span>
      </div>
      <div>
        <button @click="randomGroup(algorithm)">
          Click Me
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
