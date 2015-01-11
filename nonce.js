/**
 *
 * The Bipio Flow Pod.  nonce action definition
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

function Nonce(podConfig) {
}

Nonce.prototype = {};

function randStr (bits) {
  var chars, rand, i, ret;

  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  ret = '';

  // in v8, Math.random() yields 32 pseudo-random bits (in spidermonkey it gives 53)
  while (bits > 0) {
    // 32-bit integer
    rand = Math.floor(Math.random() * 0x100000000);
    // base 64 means 6 bits per character, so we use the top 30 bits from rand to give 30/6=5 characters.
    for (i = 26; i > 0 && bits > 0; i -= 6, bits -= 6) {
      ret += chars[0x3F & rand >>> i];
    }
  }

  return ret;
}

/**
 * Invokes (runs) the action.
 */
Nonce.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  next(false, {
    'nonce' : randStr(64)
  });
}

// -----------------------------------------------------------------------------
module.exports = Nonce;