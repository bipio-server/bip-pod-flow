/**
 *
 * The Bipio Flow Pod.  match action definition
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
var safeRegex = require('safe-regex');
function Match() {}

Match.prototype = {};


function valueMatch(pattern, val) {
  var reg = new RegExp(pattern, "i"),
  match = false;

  if (Object.prototype.toString.call(val) === '[object Object]') {
    for (var key in val) {
      match = reg.test(val[key]);
      if (match) {
        break;
      }
    }
  } else {
    match = val && (reg.test(val) || val == pattern);
  }

  return match;
}

/**
 * Invokes (runs) the action.
 */
Match.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var exports = imports,
  validRegex = false,
  pass,
  acceptOn = imports.accept_on,
  discardOn = imports.discard_on,
  matchOn = imports.funnel || imports;

  if (!acceptOn && !discardOn) {
    pass = true;
  }

  if (acceptOn) {
    if (safeRegex(acceptOn)) {
      pass = valueMatch(acceptOn, matchOn);
    } else {
      next('Regex ' + acceptOn + ' is unsafe');
    }
  }

  if (discardOn) {
    if (safeRegex(discardOn)) {
      if (valueMatch(discardOn, matchOn)) {
        pass = false;
      }
    } else {
      next('Regex ' + discardOn + ' is unsafe');
    }
  }

  if (pass) {
    next(false, {});
    return;
  }
}

// -----------------------------------------------------------------------------
module.exports = Match;
