const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// 7-15 digits (E.164 max), optional leading +, after dropping spaces, dashes and brackets.
const PHONE = /^\+?\d{7,15}$/

/** Returns an error message for the login field, or '' when `value` is a valid email / phone number. */
export function validateContact(method, value) {
  const v = value.trim()
  if (!v) return method === 'email' ? 'Enter your email' : 'Enter your phone number'
  if (method === 'email') return EMAIL.test(v) ? '' : "That email doesn't look right"
  return PHONE.test(v.replace(/[\s()-]/g, '')) ? '' : "That phone number doesn't look right"
}
