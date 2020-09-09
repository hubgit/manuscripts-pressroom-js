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

import { config } from '../../lib/config'

jest.mock('../../lib/extyles-arc')

describe('import Word via Arc', () => {
  test('imports from a Word file via Arc', async () => {
    const { app } = await import('../../app')

    const response = await request(app)
      .post('/api/v2/import/word-arc')
      .attach('file', __dirname + '/__fixtures__/manuscript.docx')
      .set('pressroom-arc-secret', Buffer.from('test:test').toString('base64'))
      .set('pressroom-api-key', config.api_key)
      .responseType('blob')

    expect(response.status).toBe(200)
    expect(response.get('Content-Type')).toBe('application/zip')
    expect(response.get('Content-Disposition')).toBe(
      'attachment; filename="manuscript.manuproj"'
    )
  })
})
