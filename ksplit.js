/**
 *
 * The Bipio Flow Pod.  keysplitter action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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

function KeySplitter(podConfig) {
    this.name = 'ksplit';
    this.description = 'Splits a JSON document by row',
    this.description_long = 'Given an JSON document, generates an export for each row',
    this.trigger = false;
    this.singleton = true;
    this.podConfig = podConfig;
}

KeySplitter.prototype = {};

KeySplitter.prototype.getSchema = function() {
    return {
        "imports": {
            "properties" : {
                "rows" : {
                    "type" : String,
                    "description" : "JSON Object"
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
KeySplitter.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    if (Object.keys(imports).length > 0) {
        if (imports.hasOwnProperty(key)) {
            for (var key in imports) {
                next(false, imports[key]);
            }    
        }
    } else {
        // silent forward
        next(false, {});
    }
}

// -----------------------------------------------------------------------------
module.exports = KeySplitter;