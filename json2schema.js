/**
 *
 * The Bipio Flow Pod.  json_to_schema action definition
 * ---------------------------------------------------------------
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var genSchema = require('generate-schema');

function JSON2Schema() {}

JSON2Schema.prototype = {};

JSON2Schema.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    try {
        next(
            false,
            {
                object : imports.source,
                schema : genSchema.json(imports.source)
            }
        );
    } catch (e) {
        next(e);
    }
}

// -----------------------------------------------------------------------------
module.exports = JSON2Schema