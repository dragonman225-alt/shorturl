import { test } from 'zora'

import { isValidUrl, toBase58 } from '../src/utils'

test('isValidUrl', t => {
  t.eq(isValidUrl(''), false)
  t.eq(isValidUrl('1234'), false)
  t.eq(isValidUrl('http://www.example.com'), true)
})

test('toBase58', t => {
  t.eq(toBase58(0), '1')
  t.eq(toBase58(58), '12')
})
