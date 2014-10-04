nexa-adapter
============

A hack to introduce support for Nexa hardware to Houm.io. Can be integrated to existing code and has been verfied to work.

#### Installation
* Install a TellStick and the [Telldus software](http://elinux.org/R-Pi_Tellstick_core) on Houm.io unit
* [Configure your Nexa hardware in /etc/tellstick.conf](http://developer.telldus.com/wiki/TellStick_conf)
* Clone this repo to Houm.io unit
* Edit existing CoffeeScript code and add something like the following to relevant places (added lines marked with an asterisk):
```
*nexa = require('./nexa-adapter')
...
onSocketMessage = (s) ->
  console.log "Received message:", s
  try
    message = JSON.parse s
*   if nexa.isRelevant message*
*     nexa.handleMessage message*
    else
      <normal processing>
```
* Configure Nexa dimmers and on/off switches through the Houm.io ui give the group address so that it contains the string "nexa" and ends in a forward slash followed be the device id given in tellstick.conf e.g. *my-nexa-dimmer/7*
