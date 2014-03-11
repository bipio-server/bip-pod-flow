/**
 *
 * The Bipio Flow Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2014 CloudSpark pty ltd http://www.cloudspark.com.au
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
  this.name = 'file_gzip';
  this.description = 'GZip Files',
  this.description_long = 'Any files present will be replaced with their GZipped equivalent',
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

FileGZip.prototype = {};

FileGZip.prototype.getSchema = function() {
  return {}
}

FileGZip.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var promises = [], deferred;

  for (var i = 0; i < contentParts._files.length; i++) {

    deferred = Q.defer();
    promises.push(
      deferred.promise
      );

    (function(deferred, file) {
      var inFilePath = file.localpath,
      inFile = fs.createReadStream(inFilePath),
      localPath = file.localpath + '.gz',
      outFile =  fs.createWriteStream(localPath),
      gzip = zlib.createGzip();

      inFile.pipe(gzip).pipe(outFile).on('close', function() {
        fs.stat(localPath, function(err, stat) {
          if (err) {
            next(err)
          } else {
            file.type = 'application/gzip';
            file.localpath = localPath;
            file.name += '.gz';
            file.size = stat.size;

            fs.unlink(inFilePath, function(err) {
              if (err) {
                next(err)
              } else {
                deferred.resolve();
              }
            });
          }
        });
      });
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