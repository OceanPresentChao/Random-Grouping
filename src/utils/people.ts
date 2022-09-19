export interface People {
  name: string
  group: number
  random: number
}

export const peopleNames = [
  '潮海波',
  '李柯凡',
  '许嘉豪',
  '鞠昌毅',
  '史昊原',
  '李炫辰',
  '张庆霄',
  '龙健超',
  '韩强',
  '单嘉澳',
  '刘湘增',
  '付轩轩',
  '吴国梁',
  '王硕',
  '张昱昊',
  '孙兰博',
  '谢志伟',
  '赵博',
]

function initPeople(peopleNames: string[]) {
  const arr: People[] = []
  peopleNames.forEach((v, index) => {
    arr.push({
      name: v,
      group: Math.floor(index / 6) + 1,
      random: 0,
    })
  })
  return arr
}

export const people = initPeople(peopleNames)
