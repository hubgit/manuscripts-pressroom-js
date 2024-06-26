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

import { authentication } from '../lib/authentication'
import { convertJATSArc } from '../lib/convert-jats-arc'
import { sendArchive } from '../lib/send-archive'
import { createRequestDirectory } from '../lib/temp-dir'
import { unzip } from '../lib/unzip'
import { upload } from '../lib/upload'
import { wrapAsync } from '../lib/wrap-async'

/**
 * @swagger
 *
 * /import/jats-arc:
 *   post:
 *     description: Convert JATS arc file to Manuscripts data via Arc
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *        description: multipart form data including ZIP file
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *                addBundledData:
 *                  type: boolean
 *     responses:
 *       200:
 *         description: Conversion success
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 */
export const importJATSArc = Router().post(
  '/import/jats-arc',
  authentication,
  upload.single('file'),
  celebrate({
    body: Joi.object({
      addBundledData: Joi.boolean().empty(''),
    }),
  }),
  createRequestDirectory,
  wrapAsync(async (req, res) => {
    const { addBundledData = false } = req.body as { addBundledData?: boolean }

    const dir = req.tempDir
    await unzip(req.file.stream, dir)

    const archive = await convertJATSArc(dir, { addBundledData })

    sendArchive(res, archive, 'manuscript.manuproj')
  })
)
