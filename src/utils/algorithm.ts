import * as cryptojs from 'crypto-js'
export interface LinearModOption {
  A?: number
  C?: number
  M?: number
}
export function* linearMod(options: LinearModOption = {}) {
  const {
    A = 27,
    C = 39,
    M = 100,
  } = options
  const seed = Date.now() / 1000
  let R = (A * seed + C) % M
  while (1)
    yield R = (A * R + C) % M
}

export interface UnidirectHashOption {
  hashType?: 'sha1' | 'sha2' | 'sha3' | 'md5'
}

export function* uniDirectHash(options: UnidirectHashOption = {}) {
  const {
    hashType = 'md5',
  } = options
  let seed = Date.now() / 1000
  while (1) {
    switch (hashType) {
      case 'md5': yield cryptojs.MD5(seed.toString()).toString()
        break
      case 'sha1': yield cryptojs.SHA1(seed.toString()).toString()
        break
      case 'sha2': yield cryptojs.SHA256(seed.toString()).toString()
        break
      case 'sha3': yield cryptojs.SHA3(seed.toString()).toString()
        break
    }
    seed++
  }
}

export interface HmacOption {
  hashType?: 'sha1' | 'sha2' | 'sha3' | 'md5'
}

export function* hmac(options: HmacOption = {}) {
  const {
    hashType = 'md5',
  } = options
  let seed = Date.now() / 1000
  const key = getOTP()
  while (1) {
    switch (hashType) {
      case 'md5': yield cryptojs.HmacMD5(seed.toString(), key).toString()
        break
      case 'sha1': yield cryptojs.HmacSHA1(seed.toString(), key).toString()
        break
      case 'sha2': yield cryptojs.HmacSHA256(seed.toString(), key).toString()
        break
      case 'sha3': yield cryptojs.HmacSHA3(seed.toString(), key).toString()
        break
    }
    seed++
  }
}

export interface ANSIXOption {
  hashType?: 'sha1' | 'sha2' | 'sha3' | 'md5'
}

export function* ANSIX(options: ANSIXOption = {}) {
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
