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

function HasFiles(podConfig) {
  this.name = 'has_files';
  this.title = 'If A File Is Present',
  this.description = 'Conditionally forward a message when a file is present',
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

HasFiles.prototype = {};

HasFiles.prototype.getSchema = function() {
  return {
    'config' : {
      properties : {
        'extension' : {
          type : "string",
          description : "File Extension (Optional)"
        }
      }
    }
  }
}

/**
 * Invokes (runs) the action.
 */
HasFiles.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var fileMatch = false, file, extRegExp;

  if (contentParts._files && contentParts._files.length) {
    for (var i = 0; i < contentParts._files.length; i++) {
      file = contentParts._files[i];
      if (channel.config.extension) {
        extRegExp = new RegExp(channel.config.extension, 'i');

        if (extRegExp.test(file.name)) {
          fileMatch = true;
          break;
        }

      } else if ('image' === channel.config.extension) {
        if (0 === file.type.indexOf('image')) {
          fileMatch = true;
          break;
        }
      } else if (!channel.config.extension) {
        fileMatch = true;
        break;
      }
    }
  }

  if (fileMatch) {
    next(false, {});
  }
}

// -----------------------------------------------------------------------------
module.exports = HasFiles;