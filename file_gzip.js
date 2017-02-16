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
var Q = require('q'),
fs = require('fs'),
zlib = require('zlib');

function FileGZip(podConfig) {

}

FileGZip.prototype = {};

FileGZip.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var promises = [],
    $resource = this.$resource,
    _ = $resource._,
    deferred;

  for (var i = 0; i < contentParts._files.length; i++) {

    deferred = Q.defer();
    promises.push(
      deferred.promise
      );

    (function(deferred, file) {

      $resource.file.save(
        file.name,
        file.localpath,
        {
          compress : true
        },
        function(err, struct) {
          if (err) {
            deferred.reject(err);
          } else {
            _.each(struct, function(value, key) {
              file[key] = value;
            });
            deferred.resolve();
          }
        }
      );
    })(deferred, contentParts._files[i]);
  }

  Q.all(promises).then(
    function() {
      next(false, {}, contentParts);
    },
    function(err) {
      next(err);
    });
}

// -----------------------------------------------------------------------------
module.exports = FileGZip;