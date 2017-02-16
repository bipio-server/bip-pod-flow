/**
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

var safeRegex = require('safe-regex');

function RegExpReplace() {}

RegExpReplace.prototype = {};

RegExpReplace.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (safeRegex(imports.regex)) {
    try {
      var exports = {
          out_str : imports.in_str.replace(new RegExp(imports.regex, 'gi'), imports.repl_str ? imports.repl_str : '')
        };

      next(false, exports);
    } catch (e) {
      next(e.message);
    }
  } else {
    next('Regex ' + imports.regex + ' is unsafe');
  }

}

// -----------------------------------------------------------------------------
module.exports = RegExpReplace;