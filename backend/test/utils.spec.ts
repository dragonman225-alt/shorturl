import { test } from 'zora'

import { toBase58 } from '../src/utils'

test('toBase58Padded', t => {
  t.eq(toBase58(0), '1')
  t.eq(toBase58(58), '12')
})
