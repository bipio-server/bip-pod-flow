/**
 *
 * The Bipio Flow Pod.  counter action definition
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

function Counter() {
  this.name = 'counter';
  this.title = 'Counter',
  this.description = 'A simple accumulator, +1 every time the channel is invoked',
  this.trigger = false;
  this.singleton = false;
}

Counter.prototype = {};

Counter.prototype.getSchema = function() {
  return {
    'imports' : {
      properties : {
        'group_by' : {
          type : "string",
          description : "Group By"
        },
        'increment_by' : {
          type : "integer",
          description : "Increment By",
          "default" : 1
        }
      }
    },
    'exports' : {
      properties : {
        'new_count' : {
          type : "integer",
          description : "New Count"
        }
      }
    },
    'renderers' : {
      'get_count' : {
        description : 'Get Count',
        description_long : 'Gets Current Count and Last Update Time',
        contentType : DEFS.CONTENTTYPE_JSON
      }
    }
  }
}

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
      last_update : app.helper.nowUTCSeconds(),
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
          res.contentType(self.getSchema().renderers[method].contentType);
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
    last_update : app.helper.nowUTCSeconds()
  },
  inc = imports.increment_by || 1;

  if (imports.group_by) {
    setter.group = imports.group_by;
  }

  dao.accumulateFilter(modelName, filter, 'count', setter, function(err) {
    if (err) {
      next(err);
    } else {
      // check if it was an upsert and give it an id if none present (yuck)
      dao.find(modelName, filter, function(err, result) {
        if (err) {
          next(err);
        } else {
          // pretty gross, is there a better way?
          if (!result.id) {
            dao.updateColumn(
              modelName,
              filter,
              {
                id : app.helper.uuid().v4(),
                created : app.helper.nowUTCSeconds()
              },
              function(err) {
                if (err) {
                  next(err);
                } else {
                  next(false, { new_count : result.count });
                }
              }
            );
          } else {
            next(false, { new_count : result.count });
          }
        }
      });
    }
  }, inc);
}

// -----------------------------------------------------------------------------
module.exports = Counter;
