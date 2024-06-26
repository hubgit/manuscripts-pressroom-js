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
import axios from 'axios'
import FormData from 'form-data'
import stream from 'stream'

const client = axios.create({
  baseURL: 'https://grobid.manuscripts.io/api',
})

export const convertPDFToTEI = async (
  file: stream.Readable
): Promise<stream.Readable> => {
  const form = new FormData()
  form.append('consolidateHeader', '1')
  form.append('consolidateCitations', '1')
  form.append('input', file, 'manuscript.pdf')

  const response = await client.post<stream.Readable>(
    '/processFulltextDocument',
    form,
    {
      headers: form.getHeaders(),
      responseType: 'stream',
    }
  )

  return response.data
}

export const extractMetaData = async (
  file: stream.Readable
): Promise<stream.Readable> => {
  const form = new FormData()
  form.append('consolidateHeader', '1')
  form.append('input', file, 'manuscript.pdf')
  // catch any response errors?
  const response = await client.post<stream.Readable>(
    '/processHeaderDocument',
    form,
    {
      headers: form.getHeaders(),
      responseType: 'stream',
    }
  )

  return response.data
}
