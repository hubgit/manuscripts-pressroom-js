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

describe('convert references via AnyStyle', () => {
  test('converts references from text to CSL-JSON', async () => {
    const { app } = await import('../../app')

    const response = await request(app)
      .post('/api/v2/convert/references-anystyle')
      .attach('file', __dirname + '/__fixtures__/references.txt')
      .set('pressroom-api-key', config.api_key)
      .responseType('blob')

    expect(response.status).toBe(200)
    expect(response.get('Content-Type')).toBe('application/json; charset=utf-8')

    const references = JSON.parse(response.body.toString())

    expect(references).toMatchSnapshot('parsed-references')
  })
})
