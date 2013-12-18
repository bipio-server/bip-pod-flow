![Flow](flow.png) bip-pod-flow
=======

Flow Control Pod for [Bipio](https://bip.io).  Handles transform filtering, 
de-duplication, token generation, representation transform transparently.

Basically, for [Pipeline](http://en.wikipedia.org/wiki/Pipeline_(software) ) filtering
and flow control across the delivery graph ([Hub](https://bip.io/docs/resource/rest/bip#resource_rest_bip_hubs))

## Installation

From bipio server root directory

    npm install bip-pod-flow
    ./tools/pod-install.js -a flow [-u optional account-wide channel auto install]

The pod-install script is a server script which will register the pod with the bipio server and add sparse
configuration to your NODE_ENV environment config ('default.json', staging or production)
keyed to 'flow', based on the default config in the pod constructor.  It will also move the
pod icon into the server cdn

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

### xml2json (singleton)

Given an XML document, converts it to usable JSON exports.

```
"action" : "flow.xml2json",
```

### nonce

Generate a Random String inline. (singleton)

```
"action" : "flow.nonce",
```

### ksplit (singleton)

Given an JSON document, generates an export for each row

```
"action" : "flow.ksplit",
```

### blackhole (singleton)

Drops a message on the floor. Ends delivery

```
"action" : "flow.blackhole",
```

[Bipio Docs](https://bip.io/docs/pods/flow)

## License

BipIO is free for non-commercial use - [GPLv3](http://www.gnu.org/copyleft/gpl.html)

Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3. 

If you'd like to integrate BipIO with your proprietary system, GPLv3 is likely incompatible. To secure a Commercial OEM License for Bipio, please [reach us](mailto:enquiries@cloudspark.com.au)

![Cloud Spark](http://www.cloudspark.com.au/cdn/static/img/cs_logo.png "Cloud Spark - Rapid Web Stacks Built Beautifully")
Copyright (c) 2010-2013  [CloudSpark pty ltd](http://www.cloudspark.com.au)
