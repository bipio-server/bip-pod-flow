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

function detectFiles() {
}

detectFiles.prototype = {};

/**
 * Invokes (runs) the action.
 */
detectFiles.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var  file, ext, $resource = this.$resource, StringDecoder = require('string_decoder').StringDecoder, decoder = new StringDecoder('utf8');
  if (contentParts._files && contentParts._files.length) {
      if (channel.config.extension) {
          ext = channel.config.extension.split(",");
          for (var i = 0; i < contentParts._files.length; i++) {
        	  file = contentParts._files[i];
        	  if ((ext.indexOf(file.name.split('.').pop()) > -1)) {
                  $resource.file.get(file, function(err, fileStruct, readStream) {
                      if (err) {
                          next(err);
                      } else {
                          var buffers = [];
                          readStream.on('data', function(chunk) {
                        	  next(false, {
                        		  body:decoder.write(chunk),
                        		  name: fileStruct.name,
                        		  size: fileStruct.size,
                        		  extension: fileStruct.name.split('.').pop()
                        	  })
                          });

                          readStream.on('error', function(err) {
                              next(err);
                          });
                      }
                  });
        	  }

     	}
      }
  }
}

// -----------------------------------------------------------------------------
module.exports = detectFiles;