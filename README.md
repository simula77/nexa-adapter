nexa-adapter
============

A hack to introduce support for Nexa hardware to Houm.io. Can be integrated to existing code and has been verfied to work.

#### Installation
* Install a TellStick and the [Telldus software](http://elinux.org/R-Pi_Tellstick_core) on Houm.io unit
* [Configure your Nexa hardware in /etc/tellstick.conf](http://developer.telldus.com/wiki/TellStick_conf)
* Clone this repo to Houm.io unit
* Edit existing Houmio CoffeeScript code and add the following line (after the line starting with "horselightsEnOceanDeviceFile"):
```
...
horselightsEnOceanDeviceFile = process.env.HORSELIGHTS_ENOCEAN_DEVICE_FILE || "/dev/cu.usbserial-FTXMJM92"

# add this line
adapter = new require('./nexa-adapter')(horselightsServer, horselightsSitekey, winston)

console.log "Using HORSELIGHTS_SERVER=#{horselightsServer}"
...
```
* Configure Nexa dimmers and on/off switches through the Houm.io ui. For each device expand Advanced options and enter "nexa" to Vendor field. Enter into Device address field the Nexa device id given in tellstick.conf e.g. *Vendor: nexa Vendor Address: 7*
