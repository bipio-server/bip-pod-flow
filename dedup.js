/**
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

function DeltaGate() {
  this.name = 'dedup';
  this.title = 'De-Duplicate',
  this.description = "Ignores Values which have been seen before",
  this.trigger = false;
  this.singleton = false;
}

DeltaGate.prototype = {};

DeltaGate.prototype.getSchema = function() {
  return {
    'imports' : {
      properties : {
        'value' : {
          type : "string",
          description : "New Value"
        }
      },
      "required" : [ "value" ]
    }
  }
}

DeltaGate.prototype.teardown = function(channel, accountInfo, next) {
  var $resource = this.$resource,
  self = this,
  dao = $resource.dao,
  log = $resource.log,
  modelName = this.$resource.getDataSourceName('dup');

  dao.removeFilter(modelName,{
    owner_id : channel.owner_id,
    channel_id : channel.id
  }, next );
}

DeltaGate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
 
  if (imports.value) {
    var $resource = this.$resource,
    self = this,
    dao = $resource.dao,
    modelName = this.$resource.getDataSourceName('dup'),
    filter = {
      owner_id : channel.owner_id,
      channel_id : channel.id,
      bip_id : sysImports.bip.id,
      value : imports.value
    },
    props = {
      last_update : app.helper.nowUTCSeconds(),
      owner_id : channel.owner_id,
      channel_id : channel.id,
      bip_id : sysImports.bip.id,
      value : imports.value
    };

    dao.find(modelName, filter, function(err, result) {
      if (err) {
        next(err);
      } else {

        if (!result || (result && result.value !== imports.value )) {
          dao.upsert(modelName, filter, props, function(err, result) {
            next(err, {});
          });
        }
      }
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = DeltaGate;