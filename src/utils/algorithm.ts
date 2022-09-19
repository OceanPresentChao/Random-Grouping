import * as cryptojs from 'crypto-js'
export interface LinearModOption {
  A?: number
  C?: number
  M?: number
  seed?: string
}
export function* linearMod(options: LinearModOption = {}) {
  const {
    A = 439,
    C = 101,
    M = 18353,
    seed = Math.round(Date.now() / 1000).toString(),
  } = options
  const tmp = Number(seed)
  let R = (A * tmp + C) % M
  while (1) {
    yield String(R)
    R = (A * R + C) % M
  }
}

export interface CyptoOption {
  hashType?: 'sha1' | 'sha2' | 'sha3' | 'md5'
  seed?: string
}

export function* uniDirectHash(options: CyptoOption = {}) {
  const {
    hashType = 'md5',
  } = options
  let {
    seed = Date.now().toString(),
  } = options
  while (1) {
    switch (hashType) {
      case 'md5': yield cryptojs.MD5(seed).toString()
        break
      case 'sha1': yield cryptojs.SHA1(seed).toString()
        break
      case 'sha2': yield cryptojs.SHA256(seed).toString()
        break
      case 'sha3': yield cryptojs.SHA3(seed).toString()
        break
    }
    seed = (Number(seed) + 1).toString()
  }
}

export function* hmac(options: CyptoOption = {}) {
  const {
    hashType = 'md5',
  } = options
  let {
    seed = Date.now().toString(),
  } = options
  const key = getOTP()
  while (1) {
    switch (hashType) {
      case 'md5': yield cryptojs.HmacMD5(seed, key).toString()
        break
      case 'sha1': yield cryptojs.HmacSHA1(seed, key).toString()
        break
      case 'sha2': yield cryptojs.HmacSHA256(seed, key).toString()
        break
      case 'sha3': yield cryptojs.HmacSHA3(seed, key).toString()
        break
    }
    seed = (Number(seed) + 1).toString()
  }
}

export function* ANSIX(options: CyptoOption = {}) {
  const {
    hashType = 'md5',
  } = options
  const key = getOTP()
  let seed = Date.now().toString()
  while (1) {
    const A = getXOR(seed, key)
    const result = crypto(A, key)
    yield result
    const B = getXOR(result, key)
    seed = crypto(B, key)
  }
  function crypto(message: string, key: string) {
    switch (hashType) {
      case 'md5': return cryptojs.HmacMD5(message, key).toString()
      case 'sha1': return cryptojs.HmacSHA1(message, key).toString()
      case 'sha2': return cryptojs.HmacSHA256(message, key).toString()
      case 'sha3': return cryptojs.HmacSHA3(message, key).toString()
    }
  }
}

export function* combinedCrypto(options: { seed?: string } = {}) {
  const {
    seed = Math.round(Date.now()).toString(),
  } = options
  const linearGen = linearMod({ seed })
  const hashGen = uniDirectHash()
  const hmacGen = hmac()
  const ansixGen = ANSIX()
  while (1) {
    const rnumber = Number(linearGen.next().value) % 3
    switch (rnumber) {
      case 0:
        yield hashGen.next().value as string
        break
      case 1:
        yield hmacGen.next().value as string
        break
      case 2:
        yield ansixGen.next().value as string
        break
    }
  }
}

function getXOR(message: string, key: string) {
  const arr = []
  for (let i = 0; i < message.length && i < key.length; i++) {
    const m = parseInt(message.substring(i, 1), 16)
    const k = parseInt(key.substring(i, 1), 16)
    arr.push((m ^ k).toString(16))
  }
  return arr.join('')
}

// 生成一个随机整数，范围是 [min, max]
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 生成一个随机的十六进制的值，在 0 ～ f 之间
function getHex() {
  let n = 0
  for (let i = 4; i > 0; i--)
    n = (getRandomInt(0, 1) << (i - 1)) + n
  return n.toString(16)
}

// 生成一个32位的十六进制值，用作一次性 Key
function getOTP() {
  const arr = []
  for (let i = 0; i < 32; i++)
    arr.push(getHex())
  return arr.join('')
}

export function sequence2Number(str: string) {
  if (!isNaN(Number(str)))
    return Number(str)
  let sum = 0
  const count = Math.min(10, str.length)
  for (let i = 0; i < count; i++)
    sum = sum * 10 + str.charCodeAt(i)
  return sum
}
