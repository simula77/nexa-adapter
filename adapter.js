var telldus = require("telldus");
var _ = require("lodash");
var WebSocket = require("ws");

module.exports = function(server, sitekey, logger) {
  var ws = new WebSocket(server);  
  var devices = telldus.getDevicesSync(function(err, devices) {
                  if (err) {
                    logger.error("Failed to read devices from TellStick!", err);
                    process.exit(1);
                  } else {
                    return JSON.stringify(devices);
                  }
                });

  ws.on("open", function() {
    ws.send(JSON.stringify({ command: "publish", data: { sitekey: sitekey, vendor: "nexa" } }));
    logger.info("Connected to " + server);
  });

  ws.on("message", function(msg) {
    logger.debug("received message %s", msg);
    handleMessage(JSON.parse(msg));
  });

  function isDimmer(deviceId) {
    return _.some(devices, function(device) {
      return (device.id == deviceId) && device.model.indexOf("dimmer") > 0;
    });
  }

  function parseOnOffValue(message) {
    return message.data.on === true ? 1 : 0;
  }

  function handleMessage(message) {
    var deviceId = parseInt(message.data.devaddr);
    var dimmer = isDimmer(deviceId);
    var value = dimmer ? parseInt(message.data.bri) : parseOnOffValue(message);
    if (dimmer && value > 0 && value < 255) {
      logger.info("setting dim level to: " + value);
      telldus.dimSync(deviceId, value);
    } else if (value === 0) {
      telldus.turnOffSync(deviceId);
    } else {
      telldus.turnOnSync(deviceId);
    }
  }

  ws.on("ping", function(ping) {
    logger.debug("ping received");
    ws.pong();
  });

  ws.on("error", function(error) {
    logger.info("Error received: %s -> exiting", error);
    process.exit(1);
  });

  ws.on("close", function() {
    logger.info("Connection closed -> exiting");
    process.exit(1);
  });
}
