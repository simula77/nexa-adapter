var telldus = require('telldus');
var _ = require('lodash');
var devices = telldus.getDevicesSync(function(err, devices) {
                if ( err ) {
                   console.log('Failed to read devices from TellStick!', err);
                   process.exit(1);
                 } else {
                   return JSON.stringify(devices);
                 }
               });

var isRelevant = function(message) {
  return message.data.groupaddress.indexOf("nexa") >= 0;
};

function isDimmer(deviceId) {
  return _.some(devices, function(device) {
    return (device.id == deviceId) && device.model.indexOf("dimmer") > 0;
  });
}

function parseDeviceId(address) {
  return parseInt(address.substring(address.lastIndexOf("/") + 1, address.length));
}

var handleMessage = function(message) {
  var deviceId = parseDeviceId(message.data.groupaddress);
  var dimmer = isDimmer(deviceId);
  var value = dimmer ? parseInt(message.data.value, 16) : parseInt(message.data.value);
  if (dimmer && value > 0 && value < 255) {
    telldus.dimSync(deviceId, value);
  } else if (value === 0) {
    telldus.turnOffSync(deviceId);
  } else {
    telldus.turnOnSync(deviceId);
  }
};

exports.isRelevant = isRelevant;
exports.handleMessage = handleMessage;