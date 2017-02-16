/**
 *
 * The Bipio Flow Pod.  Flow Actions and Content Emitters
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
