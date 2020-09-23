/*!
 * © 2019 Atypon Systems LLC
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

import wordCount from '@iarna/word-count'
import { ManuscriptNode } from '@manuscripts/manuscript-transform'
import GraphemeSplitter from 'grapheme-splitter'

const splitter = new GraphemeSplitter()

export const buildText = (node: ManuscriptNode): string => {
  const parts: string[] = []

  node.descendants((childNode: ManuscriptNode) => {
    if (childNode.isTextblock) {
      parts.push(childNode.textContent)
    }
  })
  return parts.join(' ')
}

export const countWords = async (text: string): Promise<number> =>
  wordCount(text)

export const countCharacters = async (text: string): Promise<number> => {
  return splitter.countGraphemes(text)
}