/**
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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