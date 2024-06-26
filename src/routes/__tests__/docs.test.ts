/*!
 * © 2020 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import request from 'supertest'

import { app } from '../../app'

describe('docs', () => {
  test('adds trailing slash', async () => {
    const response = await request(app).get('/api/v2/docs')

    expect(response.status).toBe(301)
    expect(response.get('Location')).toBe('/api/v2/docs/')
  })

  test('generates docs as HTML', async () => {
    const response = await request(app).get('/api/v2/docs/')

    expect(response.status).toBe(200)
    expect(response.get('Content-Type')).toBe('text/html; charset=utf-8')

    expect(response.text).toContain('<title>Swagger UI</title>')
  })

  test('generates docs as JSON', async () => {
    const response = await request(app).get('/api/v2/docs.json')

    expect(response.status).toBe(200)
    expect(response.get('Content-Type')).toBe('application/json; charset=utf-8')

    const data = JSON.parse(response.text)
    expect(data.openapi).toBe('3.0.0')
  })
})
