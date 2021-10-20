import { test } from 'zora'

import { isBlacklistedUrl, isValidUrl, toBase58 } from '../src/utils'

test('isValidUrl', t => {
  t.eq(isValidUrl(''), false)
  t.eq(isValidUrl('1234'), false)
  t.eq(isValidUrl('http://www.example.com'), true)
})

test('toBase58', t => {
  t.eq(toBase58(0), '1')
  t.eq(toBase58(58), '12')
})

test('isBlacklistedUrl', t => {
  t.eq(
    isBlacklistedUrl('http://localhost:3000/s/123', ['localhost:3000']),
    true
  )
  t.eq(
    isBlacklistedUrl('http://localhost:5000/s/123', ['localhost:3000']),
    false
  )
  t.eq(isBlacklistedUrl('http://localhost:3000/s/123', ['123']), false)
  t.eq(isBlacklistedUrl('https://www.google.com', ['localhost']), false)
  t.eq(isBlacklistedUrl('https://tinyurl.com.tw', ['tinyurl.com']), false)
  t.eq(isBlacklistedUrl('hahaha', ['localhost:3000']), true)
})
