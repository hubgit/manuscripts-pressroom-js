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
import { celebrate, Joi } from 'celebrate'
import { Router } from 'express'
import getStream from 'get-stream'

import { generateBibliography } from '../lib/generate-bibliography'
import { jwtAuthentication } from '../lib/jwt-authentication'
import { createRequestDirectory } from '../lib/temp-dir'
import { upload } from '../lib/upload'
import { wrapAsync } from '../lib/wrap-async'

/**
 * @swagger
 *
 * /export/bibliography:
 *   post:
 *     description: Convert CSL JSON to other bibliography formats
 *     produces:
 *       - text/plain
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *                format:
 *                  type: string
 *            encoding:
 *              file:
 *                contentType: application/json
 *     responses:
 *       200:
 *         description: Conversion success
 */
export const exportBibliography = Router().post(
  '/export/bibliography',
  jwtAuthentication('pressroom-js'),
  upload.single('file'),
  celebrate({
    body: {
      format: Joi.string().required(),
    },
  }),
  createRequestDirectory,
  wrapAsync(async (req, res) => {
    const { format } = req.body as { format: string }

    const json = await getStream(req.file.stream, { encoding: 'utf-8' })
    const records = JSON.parse(json)
    const output = await generateBibliography(records, format)

    // TODO: more specific content-type?
    res.type('text/plain').send(output)
  })
)