import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateContact } from './validateContact.js'

test('email', () => {
  assert.equal(validateContact('email', ' ayse@example.com '), '')
  assert.equal(validateContact('email', ''), 'Enter your email')
  assert.notEqual(validateContact('email', 'ayse@'), '')
  assert.notEqual(validateContact('email', 'ayse example.com'), '')
})

test('phone', () => {
  assert.equal(validateContact('phone', '+90 555 123 45 67'), '')
  assert.equal(validateContact('phone', '(555) 123-4567'), '')
  assert.equal(validateContact('phone', '   '), 'Enter your phone number')
  assert.notEqual(validateContact('phone', '12345'), '')
  assert.notEqual(validateContact('phone', '555-CALL-NOW'), '')
})
