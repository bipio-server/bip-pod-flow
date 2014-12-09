/**
 *
 * The Bipio Flow Pod.  generator action definition
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

function Generator(podConfig) {
}

Generator.prototype = {};

Generator.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  this.invoke.apply(this, arguments);
}

/**
 * Invokes (runs) the action.
 */
Generator.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  next(false, {
    'payload' : channel.config.payload
  });
}

// -----------------------------------------------------------------------------
module.exports = Generator;