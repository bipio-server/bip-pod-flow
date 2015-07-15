/**
 *
 * The Bipio Flow Pod.  Flow Actions and Content Emitters
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
var Pod = require('bip-pod'),
    Flow = new Pod(),
    genSchema = require('generate-schema');

Flow.rpc = function(action, method, sysImports, options, channel, req, res) {
	var self = this;

  if (method == 'json_to_schema' && 'POST' === req.method) {
  	try {
  		var schema = genSchema.json(req.body);
  		res.contentType(self.getRPCs(method).contentType);
			res.status(200).send(schema);
  	} catch (e) {
  		res.send(500).end();
  	}

  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = Flow;
