bip-pod-flow
=======

Flow Control Pod for [Bipio](https://bip.io).  Handles transform filtering, 
de-duplication, token generation, representation transform transparently.

Basically, for [Pipeline](http://en.wikipedia.org/wiki/Pipeline_(software)) filtering
and flow control across the delivery graph ([Hub](https://bip.io/docs/resource/rest/bip#resource_rest_bip_hubs))

## Installation

From bipio server install directory

    npm install bip-pod-flow

Auto install script will register the pod with the bipio server and add sparse
configuration to your NODE_ENV environment config ('default.json', staging or production)
keyed to 'flow'.

Manually restart the bipio server at your convenience.

## Actions

### match

Conditionally forwards or discards messages matching certain search patterns

```
"action" : "flow.match",
"config" : {
    "accept_on" : "special pattern",
    "discard_on" : "spammy pattern"
}
```

### xml2json

Given an XML document, converts it to usable JSON exports. (singleton)

```
"action" : "flow.xml2json",
```

### nonce

Generate a Random String inline. (singleton)

```
"action" : "flow.nonce",
```

### ksplit

Given an JSON document, generates an export for each row (singleton)

```
"action" : "flow.ksplit",
```

[Bipio Docs](https://bip.io/docs/pods/flow)

## License

BipIO is free for non-commercial use - [GPLv3](http://www.gnu.org/copyleft/gpl.html)

Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3. 

Bipio may not be used for Commercial purposes by an entity who has not secured a Bipio Commercial OEM License.  To secure a Commercial OEM License for Bipio,
please [reach us](mailto:enquiries@cloudspark.com.au)

![Cloud Spark](http://www.cloudspark.com.au/cdn/static/img/cs_logo.png "Cloud Spark - Rapid Web Stacks Built Beautifully")
Copyright (c) 2010-2013  [CloudSpark pty ltd](http://www.cloudspark.com.au)