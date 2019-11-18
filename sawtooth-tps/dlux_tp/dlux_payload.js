/**
 * Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class DluxPayload {
    constructor(name, action, desc, addr) {
        this.name = name
        this.action = action
        this.desc = desc
        this.addr = addr
    }

    static fromBytes(payload) {
        payload = payload.toString().split(/(?!\B"[^"]*),(?![^"]*"\B)/g)
        if (payload.length === 4) {
            let dluxPayload = new DluxPayload(payload[0], payload[1], payload[2], payload[3])
            if (!dluxPayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (dluxPayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (!dluxPayload.action) {
                throw new InvalidTransaction('Action is required')
            }
            return dluxPayload
        } else if (payload.length === 2) {
            let dluxPayload = new DluxPayload(payload[0], payload[1])
            if (!dluxPayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (dluxPayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (dluxPayload.action !== 'veri') {
                throw new InvalidTransaction('Invalid action or data')
            }
            return dluxPayload
        } else {
            throw new InvalidTransaction('Invalid payload serialization')
        }
    }
}

module.exports = DluxPayload