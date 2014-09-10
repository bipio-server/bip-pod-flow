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
  this.name = 'delta_gate';
  this.title = 'Key/Value Change Forwarder',
  this.description = 'Given a key,value pair, continues graph processing if the value has changed',
  this.trigger = false;
  this.singleton = false;
}

DeltaGate.prototype = {};

DeltaGate.prototype.getSchema = function() {
  return {
    'imports' : {
      properties : {
        'key' : {
          type : "string",
          description : "Unique Key"
        },
        'value' : {
          type : "string",
          description : "Tracking Value"
        }
      },
      required : [ 'key' ]
    }
  }
}

DeltaGate.prototype.teardown = function(channel, accountInfo, next) {
  var $resource = this.$resource,
  self = this,
  dao = $resource.dao,
  log = $resource.log,
  modelName = this.$resource.getDataSourceName('delta_gate');

  dao.removeFilter(modelName,{
    owner_id : channel.owner_id,
    channel_id : channel.id
  }, next );
}

DeltaGate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  if (imports.key) {
    var $resource = this.$resource,
    self = this,
    dao = $resource.dao,
    modelName = this.$resource.getDataSourceName('delta_gate'),
    filter = {
      owner_id : channel.owner_id,
      channel_id : channel.id,
      key : imports.key
    },
    props = {
      last_update : app.helper.nowUTCSeconds(),
      owner_id : channel.owner_id,
      channel_id : channel.id,
      key : imports.key,
      value : imports.value
    };

    dao.find(modelName, filter, function(err, result) {
      if (err) {
        next(err);
      } else {

        if (!result || (result && result.value !== imports.value )) {
          next(false, {});
        }

        dao.upsert(modelName, filter, props, function(err, result) {
          if (err) {
            next(err);
          }
        });
      }
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = DeltaGate;