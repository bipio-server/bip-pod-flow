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

function FileToText() {
}

FileToText.prototype = {};

/**
 * Invokes (runs) the action.
 */
FileToText.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var file,
    ext,
    $resource = this.$resource,
    ext = imports.extension.split(",").map(function(ext) {
      return ext.toLowerCase();
    });

  if (contentParts._files && contentParts._files.length) {
    for (var i = 0; i < contentParts._files.length; i++) {
  	  file = contentParts._files[i];
  	  if (ext.indexOf(file.name.toLowerCase().split('.').pop()) > -1) {
        $resource.file.get(file, function(err, fileStruct, readStream) {
            if (err) {
                next(err);
            } else {
                var buf = new Buffer(fileStruct.size);

                readStream.pause();

                readStream.on('data', function(chunk) {
                  buf.write(chunk.toString(), 'utf-8');
                });

                readStream.on('end', function() {
                  next(false, {
                    body: buf.toString(),
                    name: fileStruct.name,
                    size: fileStruct.size,
                    extension: fileStruct.name.split('.').pop()
                  })
                });

                readStream.on('error', function(err) {
                    next(err);
                });

                readStream.resume();
            }
        });
  	  }
	  }

  }
}

// -----------------------------------------------------------------------------
module.exports = FileToText;