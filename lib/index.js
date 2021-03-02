var EventEmitter = require('events');
var inherits = require('util').inherits;
var URL = require('url').URL;
var net = require('net');

var CONSTANTS = require('./constants');
var CRLF = "\r\n";

var mtsics = function(options) {
  EventEmitter.call(this);
  var self = this;
  this.options = options || {};
  this.timeout = this.options.timeout || 1000;
  this._data = '';
  this._state = 'init';
  this._queue = [];
  if (this.options.uri) {
    var uri = new URL(this.options.uri);
    switch (uri.protocol) {
      case 'tcp':
      case 'tcp:':
        var socket = new net.Socket();
        socket.on('error', function(err) {
          self._state = 'error';
          self._processQueue();
        });
        socket.on('data', function(data) {
          self.write(data);
        });
        socket.connect(uri.port, uri.hostname, function(err) {
          if (err) {
            self._state = 'error';
          }
          self._processQueue();
        });
        this.on('sending', function(send) {
          socket.write(send);
        });
        this.on('close', function() {
          self._state = 'error';
          socket.destroy();
        });
        break;
    }
  } else {
    this._state = 'ready';
  }
};
inherits(mtsics, EventEmitter);

mtsics.prototype._parseArg = function(val) {
  if (val.startsWith('"') && val.endsWith('"')) {
    return val.slice(1, -1);
  }
  if (val.match(/^[0-9]*\.?[0-9]*$/)) {
    return parseFloat(val);
  }
  return val;
};

mtsics.prototype._processQueue = function() {
  if (this._state === 'error') {
    if (this._queue.length) {
      this._queue.shift()[2](new Error('could not connect'));
      this._processQueue();
    }
  } else {
    this._state = 'ready';
    if (this._queue.length) {
      this._send.apply(this, this._queue.shift());
    }
  }
};

mtsics.prototype._send = function(cmd, args, cb) {
  var self = this;

  if (this._state === 'error') {
    return cb(new Error('could not connect'));
  }

  if (this._state !== 'ready') {
    return this._queue.push([cmd, args, cb]);
  }

  var send = cmd;
  args.forEach(function(arg) {
    send += " ";
    if (typeof arg === "string") {
      send += '"' + arg + '"';
    }
  });
  send += CRLF;
  this._state = 'busy';
  this.emit('sending', send);
  
  var command = CONSTANTS[cmd];
  var listData = [];

  var onData = function(line) {
    // split space not in quotes
    var args = line.match(/(?:[^\s"]+|"[^"]*")+/g);
    args = args.slice(2);
    // generic Errors
    if (line.startsWith('ES')) {
      self.removeListener('data', onData);
      self._processQueue();
      return cb(new Error('Syntax Error!'));
    }
    if (line.startsWith('ET')) {
      self.removeListener('data', onData);
      self._processQueue();
      return cb(new Error('Transmission Error!'));
    }
    if (line.startsWith('EL')) {
      self.removeListener('data', onData);
      self._processQueue();
      return cb(new Error('Logical Error!'));
    }
    // Error
    Object.keys(command.errors).forEach(function(error) {
      if (line.startsWith(error)) {
        self.removeListener('data', onData);
        self._processQueue();
        cb(new Error(command.errors[error]));
      }
    });
    // List of data
    if (command.list) {
      Object.keys(command.list).forEach(function(list) {
        if (line.startsWith(list)) {
          var data = {};
          command.list[list].forEach(function(name, i) {
            if (args[i]) {
              data[name] = self._parseArg(args[i]);
            }
          });
          listData.push(data);
        }
      });
    }
    // Success
    Object.keys(command.success).forEach(function(success) {
      if (line.startsWith(success)) {
        self.removeListener('data', onData);
        self._processQueue();
        if (Array.isArray(command.success[success])) {
          var data = {};
          command.success[success].forEach(function(name, i) {
            if (args[i]) {
              data[name] = self._parseArg(args[i]);
            }
          });
          cb(null, data);
        } else {
          if (command.success[success] === null) {
            return cb(null, listData);
          } else if (typeof command.success[success] === "string") {
            cb(null, command.success[success]);
          }
        }
      }
    });
  };
  this.on('data', onData);
};

mtsics.prototype.write = function(data, cb) {
  this._data += data;
  while (this._data.includes(CRLF)) {
    var index = this._data.indexOf(CRLF);
    this.emit('data', this._data.slice(0, index));
    this._data = this._data.slice(index + 2);
  }
  if (cb) {
    cb();
  }
};

mtsics.prototype.close = function() {
  this.emit('close');
};

mtsics.prototype.get_port = function() {
  
};

mtsics.prototype.get_commands = function(cb) {
  // Inquiry of all implemented MT-SICS commands.
  this._send('I0', [], cb);
};

mtsics.prototype.get_mtsics_level = function(cb) {
  // Inquiry of MT-SICS level and MT-SICS versions.
  this._send('I1', [], cb);
};

mtsics.prototype.get_balance_data = function(cb) {
  // Inquiry of balance data.
  this._send('I2', [], cb);
};

mtsics.prototype.get_software_version = function(cb) {
  // Inquiry of balance SW version and type definition number.
  this._send('I3', [], cb);
};

mtsics.prototype.get_serial_number = function(cb) {
  // Inquiry of serial number.
  this._send('I4', [], cb);
};

mtsics.prototype.get_software_id = function(cb) {
  // Inquiry of SW-Identification number.
  this._send('I5', [], cb);
};

mtsics.prototype.get_weight_stable = function(cb) {
  // Send the current stable net weight value.
  this._send('S', [], cb);
};

mtsics.prototype.get_weight = function(cb) {
  // Send the current net weight value, irrespective of balance stability.
  this._send('SI', [], cb);
};

mtsics.prototype.zero_stable = function(cb) {
  // Zero the balance.
  this._send('Z', [], cb);
};

mtsics.prototype.zero = function(cb) {
  // Zero the balance immediately regardless the stability of the balance.
  this._send('ZI', [], cb);
};

mtsics.prototype.reset = function(cb) {
  // Resets the balance to the condition found after switching on, but without a zero setting being performed.
  this._send('@', [], cb);
};

module.exports = mtsics;