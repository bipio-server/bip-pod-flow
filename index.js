/**
 * 
 * The Bipio Flow Pod.  Flow Actions and Content Emitters
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
var Pod = require('bip-pod'),
    Flow = new Pod({
        name : 'flow',
        description : 'Flow',
        description_long : 'Control flows, filtering, token generation for hubs, inline',
        dataSources : [ 
            require('./models/counter'),
        ]
    });

Flow.add(require('./match.js'));
Flow.add(require('./xml2json.js'));
Flow.add(require('./nonce.js'));
Flow.add(require('./ksplit.js'));
Flow.add(require('./lsplit.js'));
Flow.add(require('./blackhole.js'));
Flow.add(require('./counter.js'));
Flow.add(require('./text2json.js'));
Flow.add(require('./entity_encode.js'));
Flow.add(require('./entity_decode.js'));
Flow.add(require('./generator.js'));
Flow.add(require('./file_gzip.js'));
Flow.add(require('./regex_replace.js'));
Flow.add(require('./truthy.js'));
Flow.add(require('./falsy.js'));

// -----------------------------------------------------------------------------
module.exports = Flow;
