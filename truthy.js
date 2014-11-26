/**
 *
 * The Bipio Flow Pod.  match action definition
 * ---------------------------------------------------------------
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
function Truthy(podConfig) {
  this.name = 'truthy';
  this.title = 'Input is Truthy',
  this.description = 'Conditionally forwards a message if the input has a true-like value',
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

Truthy.prototype = {};

Truthy.prototype.getSchema = function() {
  return {
    "imports": {
      properties : {
        'value' : {
          type : 'string',
          description : 'Input Value'
        }
      }
    }
  }
}

Truthy.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var val = ((imports && imports.value)
      ? imports.value.toString().trim().toLowerCase()
      : null),
    truthy = (true === val || /1|yes|y|true/g.test(val));

  if (truthy) {
    next(false, {});
  }
}

// -----------------------------------------------------------------------------
module.exports = Truthy;
