/**
 *
 * The Bipio Flow Pod
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

function LineSplitter(podConfig) {
  this.name = 'lsplit';
  this.title = 'Split Text by Line',
  this.description = 'Generates an export for every line in a text document (Windows/Mac/Linux)',
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

LineSplitter.prototype = {};

LineSplitter.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "body" : {
          "type" : "string",
          "description" : "Text Body"
        }
      }.
      "required" : [ "body" ]
    },
    "exports": {
      "properties" : {
        "index" : {
          "type" : "integer",
          "description" : "Line Number"
        },
        "value" : {
          "type" : "string",
          "description" : "Line Value"
        }
      }
    }
  }
}

/**
 * Invokes (runs) the action.
 */
LineSplitter.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.body) {
    var lines = imports.body.split(/[\n(?\r)]/),
      line;

    for (var i = 0; i < lines.length; i++) {
      line = lines[i].trim();
      if (line) {
        next(
          false,
          {
            index : i,
            value : line
          }
        );
      }
    }
  }
}

// -----------------------------------------------------------------------------
module.exports = LineSplitter;