/**
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

function DeltaGate() {}

DeltaGate.prototype = {};

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
      last_update : $resource.helper.nowUTCMS(),
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
          var l = Number(result ? result.value : 0),
            r = Number(imports.value),
            precision = Number(imports.delta_precision)
            exports = {
              delta : imports.value
            };

          if (isNaN(precision)) {
            precision = Number(self.getSchema().imports.delta_precision);
          }

          // if tracking numeric values, exports the difference
          // of new and old
          if (!isNaN(l) && !isNaN(r)) {
            exports.delta = Number(Number(r - l).toFixed(precision))
          }

          next(false, exports);
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