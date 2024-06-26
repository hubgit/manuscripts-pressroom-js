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

import { ConnectConfig } from 'ssh2'
import Client from 'ssh2-sftp-client'
import { Readable } from 'stream'

export const depositSFTP = async (
  input: string | Buffer | Readable,
  remoteFilePath: string,
  options: ConnectConfig
): Promise<void> => {
  const client = new Client()
  await client.connect(options)
  await client.put(input, remoteFilePath)
  await client.end()
}
