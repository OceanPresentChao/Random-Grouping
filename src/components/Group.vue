<script setup lang="ts">
import { computed, ref } from "vue";
import { people } from '../utils/people';
import { linearModRandom } from "../utils/algorithm"
type RandomAlgorithm = "linearMod"
const algorithmSelections = ["linearMod"]
const algorithm = ref<RandomAlgorithm>('linearMod')
const origin = ref(people)
const group = computed(() => {
  const result = []
  for (let i = 0; i < origin.value.length; i += 3) {
    result.push([origin.value[i], origin.value[i + 1], origin.value[i + 2]])
  }
  return result
})
function randomGroup(algorithm: RandomAlgorithm) {
  if (algorithm === "linearMod") {
    origin.value = linearModRandom(origin.value)
  }
}


</script>

<template>
  <div class="container">
    <div>
      <p style="font-size: large;font-weight: 600;">Random Grouping Tool</p>
      <div>
        <span>Algorithm: </span>
        <select name="algorithm" v-model="algorithm">
          <option v-for="(val,index) in algorithmSelections" :value="val">{{val}}</option>
        </select>
      </div>
    </div>
    <div>
      <div v-for="(v,i) in group" :key="i">
        <span>Group{{i+1}}:</span>
        <span v-for="(p) in v">{{p}}</span>
      </div>
      <div>
        <button @click="randomGroup(algorithm)">Click Me</button>
      </div>
    </div>
  </div>
</template>

<style>

</style>
