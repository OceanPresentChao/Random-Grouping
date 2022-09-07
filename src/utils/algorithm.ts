export function linearModRandom<T>(arr: Array<T>): Array<T> {
  function* getRandomNumber() {
    const seed = Date.now() / 1000
    const A = 27
    const C = 39
    const M = 18
    let R = (A * seed + C) % M
    while (1) {
      yield R = (A * R + C) % M
    }
  }
  const generator = getRandomNumber()
  let result = arr.concat().map((v) => ({ val: v, index: generator.next().value as number }))
  result.sort((a, b) => {
    return a.index - b.index;
  })
  return result.map((v) => v.val)
}