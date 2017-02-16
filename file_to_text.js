/**
 *
 * The Bipio Flow Pod.  nonce action definition
 * ---------------------------------------------------------------
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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