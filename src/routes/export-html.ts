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
import archiver from 'archiver'
import { celebrate, Joi } from 'celebrate'
import { Router } from 'express'
import fs from 'fs-extra'

import { authentication } from '../lib/authentication'
import { createArticle } from '../lib/create-article'
import { createHTML } from '../lib/create-html'
import { logger } from '../lib/logger'
import { chooseManuscriptID } from '../lib/manuscript-id'
import { createHTMLArchivePathGenerator } from '../lib/path-generator'
import { sendArchive } from '../lib/send-archive'
import { createRequestDirectory } from '../lib/temp-dir'
import { unzip } from '../lib/unzip'
import { upload } from '../lib/upload'
import { wrapAsync } from '../lib/wrap-async'

/**
 * @swagger
 *
 * /export/html:
 *   post:
 *     description: Convert manuscript data to a ZIP file containing an HTML file
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *                manuscriptID:
 *                  type: string
 *            encoding:
 *              file:
 *                contentType: application/zip
 *     responses:
 *       200:
 *         description: Conversion success
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 */
export const exportHtml = Router().post(
  '/export/html',
  authentication,
  upload.single('file'),
  chooseManuscriptID,
  celebrate({
    body: {
      manuscriptID: Joi.string().required(),
    },
  }),
  createRequestDirectory,
  wrapAsync(async (req, res) => {
    const { manuscriptID } = req.body as {
      manuscriptID: string
    }

    const dir = req.tempDir

    logger.debug(`Extracting ZIP archive to ${dir}`)
    await unzip(req.file.stream, dir)

    // read the data
    const { data } = await fs.readJSON(dir + '/index.manuscript-json')
    const { article, modelMap } = createArticle(data, manuscriptID)

    // prepare the output archive
    const archive = archiver.create('zip')

    // create HTML
    const html = await createHTML(article.content, modelMap, {
      mediaPathGenerator: createHTMLArchivePathGenerator(dir, archive),
    })

    archive.append(html, { name: 'manuscript.html' })

    archive.finalize()

    sendArchive(res, archive)
  })
)
