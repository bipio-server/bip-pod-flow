/**
 *
 * The Bipio Flow Pod.  counter action definition
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

function Counter() {
}

Counter.prototype = {};

Counter.prototype.setup = function(channel, accountInfo, next) {
  var $resource = this.$resource,
  self = this,
  dao = $resource.dao,
  log = $resource.log,
  modelName = this.$resource.getDataSourceName('counter');

  (function(channel, accountInfo, next) {
    var counterStruct = {
      owner_id : channel.owner_id,
      channel_id : channel.id,
      last_update : $resource.helper.nowUTCMS(),
      counter : 0
    }

    model = dao.modelFactory(modelName, counterStruct, accountInfo);
    dao.create(model, function(err, result) {
      if (err) {
        log(err, channel, 'error');
      }
      next(err, 'channel', channel);

    }, accountInfo);
  })(channel, accountInfo, next);
};

Counter.prototype.teardown = function(channel, accountInfo, next) {
  var $resource = this.$resource,
  self = this,
  dao = $resource.dao,
  log = $resource.log,
  modelName = this.$resource.getDataSourceName('counter');

  dao.removeFilter(modelName,{
    owner_id : channel.owner_id,
    channel_id : channel.id
  }, next );
}

Counter.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  var $resource = this.$resource,
    self = this,
    dao = $resource.dao,
    log = $resource.log,
    modelName = this.$resource.getDataSourceName('counter');

  if ('get_count' === method) {

     var currentPage = parseInt(req.query.page) || 1,
        currentPageSize = parseInt(req.query.page_size) || 10,
        orderBy = ['entity_created', 'desc'];

    dao.list(
      modelName,
      null,
      currentPageSize,
      currentPage,
      orderBy,
      {
        owner_id : channel.owner_id,
        channel_id : channel.id
      },
      function(err, modelName, results) {
        if (err) {
          log(err, 'channel', 'error');
          res.send(500);
        } else {
          res.contentType(self.pod.getActionRPC(self.name, method).contentType);
          res.send(results);
        }
      }
    );

  } else {
    res.send(404);
  }
}

Counter.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource,
  self = this,
  dao = $resource.dao,
  modelName = this.$resource.getDataSourceName('counter'),
  filter = {
      owner_id : channel.owner_id,
      channel_id : channel.id,
      group : imports.group_by
    },
  setter = {
    last_update : $resource.helper.nowUTCMS()
  },
  inc = imports.increment_by || 1;

  if (imports.group_by) {
    setter.group = imports.group_by;
  }

  $resource.accumulateFilter('counter', filter, setter, inc, function(err, newCount) {
    if (err) {
      next(err);
    } else {
      next(false, { new_count : newCount });
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = Counter;
