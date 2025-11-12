#!/usr/bin/env node
import got from 'got'
import { CookieJar } from 'tough-cookie'

// Simple integration test for login -> refresh -> logout flows.
// Usage: BASE_URL=http://localhost:3000/api node scripts/auth-integration.js

const BASE = (process.env.BASE_URL || 'http://localhost:3000')
const API = BASE.replace(/\/$/, '') + '/api'

const email = process.env.TEST_EMAIL || `int-test+${Date.now()}@example.com`
const password = process.env.TEST_PASSWORD || 'Password1A'
const username = process.env.TEST_USERNAME || `inttest${Date.now()}`

const jar = new CookieJar()
const client = got.extend({ prefixUrl: API, cookieJar: jar, responseType: 'json', throwHttpErrors: false })

const ok = (cond, msg) => {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exitCode = 2
  } else {
    console.log('OK:', msg)
  }
}

const run = async () => {
  console.log('API base:', API)

  // 1) Signup
  console.log('Signup', { email, username })
  const s = await client.post('signup', { json: { email, username, password } })
  ok(s.statusCode === 201 || s.statusCode === 200, `signup should return 200/201; got ${s.statusCode}`)

  // 2) Login
  console.log('Login')
  const l = await client.post('login', { json: { email, password } })
  ok(l.statusCode === 200, `login should return 200; got ${l.statusCode}`)
  const bodyL = l.body || {}
  ok(bodyL.accessToken, 'login response should include accessToken')

  // Verify cookie present in jar
  const cookies = await jar.getCookies(API)
  const rtCookie = cookies.find(c => c.key === 'refresh_token')
  ok(!!rtCookie, 'refresh_token cookie should be set after login')

  // 3) Refresh (cookie-only)
  console.log('Refresh token (cookie)')
  const r = await client.post('token/refresh')
  ok(r.statusCode === 200, `refresh should return 200; got ${r.statusCode}`)
  const bodyR = r.body || {}
  ok(bodyR.accessToken, 'refresh response should include accessToken')

  // 4) Logout (cookie-only)
  console.log('Logout')
  const o = await client.post('token/logout')
  ok(o.statusCode === 200, `logout should return 200; got ${o.statusCode}`)

  // Ensure cookie cleared (attempt to get cookies again)
  const cookiesAfter = await jar.getCookies(API)
  const rtCookieAfter = cookiesAfter.find(c => c.key === 'refresh_token')
  ok(!rtCookieAfter, 'refresh_token cookie should be cleared after logout')

  console.log('\nIntegration test complete. If any step printed FAIL above, exit code is non-zero.')
}

run().catch(err => {
  console.error('Error during integration test:', err.message || err)
  process.exitCode = 3
})
