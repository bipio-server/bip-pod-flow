/**
 *
 * The Bipio Flow Pod.  xml2json action definition
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

var xml2json = require('xml2json');

function XML2JSON() {}

XML2JSON.prototype = {};

/**
 * Invokes (runs) the action.
 */
XML2JSON.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    try {
        var json = xml2json.toJson(imports.body, { object : true});
        if (json) {
            next(false, { json : json });
        } else {
            next('Payload could not be parsed');
        }
    } catch (e) {
        next(e);
    }
}

// -----------------------------------------------------------------------------
module.exports = XML2JSON