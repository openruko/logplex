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

## License

logplex and other openruko components are licensed under MIT.  
[http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)

## Authors and Credits

Matt Freeman  
[email me - im looking for some remote work](mailto:matt@nonuby.com)  
[follow me on twitter](http://www.twitter.com/nonuby )
