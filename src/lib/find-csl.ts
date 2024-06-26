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
import { Bundle, Manuscript, Model } from '@manuscripts/manuscripts-json-schema'
import { basename } from 'path'

export const findCSL = async (
  manuscript: Manuscript,
  modelMap: Map<string, Model>
): Promise<string | undefined> => {
  if (manuscript.bundle) {
    const bundle = modelMap.get(manuscript.bundle) as Bundle | undefined
    const identifier = bundle?.csl?.cslIdentifier

    if (identifier) {
      const id = basename(identifier)

      // TODO: check that the file exists in $HOME/.pandoc/csl?
      return `${id}.csl`
    }
  }
}
