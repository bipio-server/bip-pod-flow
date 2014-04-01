/**
 *
 * The Bipio Flow Pod.  match action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2014 CloudSpark pty ltd http://www.cloudspark.com.au
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
function Falsy(podConfig) {
  this.name = 'falsy';
  this.description = 'Input is Falsy',
  this.description_long = 'Conditionally forwards a message if the input has a false-like value',
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

Falsy.prototype = {};

Falsy.prototype.getSchema = function() {
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

Falsy.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var val = ((imports && imports.value) 
      ? imports.value.toString().trim().toLowerCase() 
      : null),
    falsy = (!val || /0|no|n|false/g.test(val));

  if (falsy) {
    next(false, {});
  }  
}

// -----------------------------------------------------------------------------
module.exports = Falsy;