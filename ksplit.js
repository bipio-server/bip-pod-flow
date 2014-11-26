/**
 *
 * The Bipio Flow Pod.  keysplitter action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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

function KeySplitter() {}

KeySplitter.prototype = {};

/**
 * Invokes (runs) the action.
 */
KeySplitter.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.rows) {
    var rows = imports.rows;
    if (Object.keys(rows).length > 0) {
      if (rows.hasOwnProperty(key)) {
        var i = 0;
        for (var key in rows) {
          if (rows.hasOwnProperty(key)) {
            next(
              false,
              {
                index : i,
                key : key,
                value : rows[key]
              }
            );
            i++;
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
module.exports = KeySplitter;