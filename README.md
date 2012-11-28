# Logplex - Primitive some-what compatible logplex

## Introduction

Simple some-what logplex compatible log sink I used whilst debugging, not feature complete,
no persistence etc..

## Requirements

Tested on Linux 3.2 using  node 0.8

On a fresh Ubuntu 12.04 LTS instance:
```
apt-get install nodejs
```

Please share experiences with CentOS, Fedora, OS X, FreeBSD etc...
Note: buildpacks might have environment dependencies that you need to add to the host OS.

## Installation

Step 1:
```
git clone https://github.com/openruko/logplex.git logplex
npm install .
```
Step 2:

Configure LOGPLEX_SERVER in other openruko components

## Environment Variables

logplex/bin/logplex will check the presence of several environment variables,
these must be configured as part of the process start - e.g. configured in
supervisord or as part of boot script. see ./logplex/conf.js

* WEBPORT - Port for API interface
* UDP - Port to receive log messages from

## Launch

```
foreman start
```

## Help and Todo

A lot...

## How to use

Logplex is part of the `openuko logs` command. But you can use it alone.

Start logplex

```
cd logplex
./debug.launch &
```

Create a session with one or more tokens.
A token is used to identify the origin of the log. It contains some attributes :
  * channel: [app, heroku]
  * source: web.1, worker.3, router

```
$ curl -H 'Content-Type: application/json' -XPOST localhost:9996/sessions -d '{"tokens": [{"id": "0010aa99-f5d5-4968-8167-8c4d618c9443", "channel": "app", "source": "run.1"}]}'
{"id":"4b5f0918-3943-47f8-a79c-9ad9d42eb6ed"}
```

Note the returned id.

Use it to send a log in UDP. The format is the following :

<timestamp><space><tokenId><space><msg>

```
echo -n "1353485842018 0010aa99-f5d5-4968-8167-8c4d618c9443 Hello World\n" | nc -4u -q1 localhost 9999
```

Now print the logs:

```
curl localhost:9996/sessions/4b5f0918-3943-47f8-a79c-9ad9d42eb6ed
```

## License

logplex and other openruko components are licensed under MIT.
[http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)

## Authors and Credits

Matt Freeman
[email me - im looking for some remote work](mailto:matt@nonuby.com)
[follow me on twitter](http://www.twitter.com/nonuby )
