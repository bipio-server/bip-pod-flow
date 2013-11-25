/**
 *
 * The Bipio Flow Pod.  counter action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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
  this.description = 'Counter',
  this.description_long = 'A simple accumulator, +1 every time the channel is invoked',
  this.trigger = false;
  this.singleton = false;
}

Counter.prototype = {};

Counter.prototype.getSchema = function() {
  return {
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
    var feedStruct = {
      owner_id : channel.owner_id,
      channel_id : channel.id,
      last_update : app.helper.nowUTCSeconds(),
      counter : 0
    }

    model = dao.modelFactory(modelName, feedStruct, accountInfo);
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
    dao.find(
      modelName, 
      {
        owner_id : channel.owner_id,
        channel_id : channel.id
      },
      function(err, result) {
        if (err) {
          log(err, channel);
          res.send(500);
        } else {
          res.contentType(self.getSchema().renderers[method].contentType);
          res.send({
            last_update : result.last_update,
            count : result.count
          });      
        }
      }
    );
    
  }
}

/**
 * Invokes (runs) the action.
 */
Counter.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource,
  self = this,
  dao = $resource.dao,
  modelName = this.$resource.getDataSourceName('counter');

  dao.accumulateFilter(
    modelName, 
    {
      owner_id : channel.owner_id,
      channel_id : channel.id
    },
    'count'
    );   
  
  next(false, {});
}

// -----------------------------------------------------------------------------
module.exports = Counter;