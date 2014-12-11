/**
 *
 * The Bipio Flow Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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