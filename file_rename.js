/**
 *
 * The Bipio Flow Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2015 wot.io http://wot.io
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
var Q = require('q'),
zlib = require('zlib');

function FileRename() {
}

FileRename.prototype = {};

FileRename.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  for (var i = 0; i < contentParts._files.length; i++) {
    contentParts._files[i].name = imports.file_new_name;
  }

  next(false, {}, contentParts);
}

// -----------------------------------------------------------------------------
module.exports = FileRename;