/**
 *
 * The Bipio Flow Pod.  match action definition
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
function Match(podConfig) {
    this.name = 'match';
    this.description = 'Filter messages by a search pattern',
    this.description_long = 'Conditionally forwards or discards messages matching certain search patterns',
    this.trigger = false;
    this.singleton = false;
    this.podConfig = podConfig;
}

Match.prototype = {};

Match.prototype.getSchema = function() {
    return {
        'config' : {
            properties : {
                accept_on : {
                    type: "string",
                    description: 'Accept if content matches',
                    optional: true
                },
                discard_on : {
                    type: "string",
                    description: 'Discard if content matches',
                    optional: true
                }
            }
        },
        "imports": {
            properties : {
                'funnel' : {
                    type : 'string',
                    description : 'Content Funnel.  If empty, matches any import'
                }
            }
        }
    }
}

function valueMatch(pattern, obj, attrib) {
    var reg = new RegExp(pattern),
        match = false;

    if (attrib == '*') {
        for (key in obj) {
            console.log('testing ' + obj[key]);
            match = reg.test(obj[key]);
            if (match) {
                break;
            }
        }
    } else {
        match = obj[attrib] && reg.test(obj[attrib]);
    }

    return match;
}

/**
 * Invokes (runs) the action.
 */
Match.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var exports = imports;

    if (channel.config.accept_on || channel.config.discard_on) {
        var pass = true,
            deny = channel.config.discard_on,
            allow = channel.config.accept_on;

        if (allow) {
            pass = valueMatch(allow, imports, key);
        }

        if (deny) {
            for (var key in deny) {
                if (valueMatch(deny[key], imports, key)) {
                    pass = false;
                }
            }
        }

        // black hole it if !pass
        if (pass) {
            next(false, exports);
        }

    } else {
        next(false, exports);
    }
}

// -----------------------------------------------------------------------------
module.exports = Match;