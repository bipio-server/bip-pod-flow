/**
 *
 * The Bipio Flow Pod
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
var crypto = require('crypto');

function FileCreateText(podConfig) {

}

FileCreateText.prototype = {};

FileCreateText.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var dataDir = this.pod.getDataDir(channel, 'file_create_text');

  this.$resource.file.save(
    dataDir + '/' + crypto.createHash('md5').update(imports.contents).digest('hex'),
    new Buffer(imports.contents),
    function(err, struct) {
      if (err) {
        next(err);
      } else {
        struct.name = imports.file_name;
        contentParts._files.push(struct);
        next(false, {}, contentParts);
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = FileCreateText;