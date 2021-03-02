# mt-sics
a node.js interface library to Mettler Toledo balances and scales that use the Mettler Toledo Standard Interface Command Set (MT-SICS).

## Installation

Installation uses the [npm](http://npmjs.org/) package manager.  Just type the following command after installing npm.

  npm install mt-sics

## Mettler Toledo RS232 Setup

  | BAUDRATE | BIT/PARITY | STOP BITS | HANDSHAKE | END OF LINE  | CHAR SET | CONTINUOUS MODE |
  |----------|------------|-----------|-----------|--------------|----------|-----------------|
  |     9600 | 8/NO       |         1 | NONE      | \<CR\>\<LF\> | ANSI/WIN | OFF             |

## Example

```javascript
var MTSICS = require('mt-sics');
var mtsics = new MTSICS({uri: 'tcp://192.168.1.1:4001'});
mtsics.get_commands(function(err, commands) {
  if (err) {
    return console.log(err);
  }
  console.log(commands);
});
```

## Documentation

  | function | arguments | description |
  |----------|-----------|-------------|
  | get_commands | callback | Inquiry of all implemented MT-SICS commands. |
  | get_mtsics_level | callback | Inquiry of MT-SICS level and MT-SICS versions. |
  | get_balance_data | callback | Inquiry of balance data. |
  | get_software_version | callback | Inquiry of balance SW version and type definition number. |
  | get_serial_number | callback | Inquiry of serial number. |
  | get_software_id | callback | Inquiry of SW-Identification number. |
  | get_weight_stable | callback | Send the current stable net weight value. |
  | get_weight | callback | Send the current net weight value, irrespective of balance stability. |
  | zero_stable | callback | Zero the balance. |
  | zero | callback | Zero the balance immediately regardless the stability of the balance. |
  | reset | callback | Resets the balance to the condition found after switching on, but without a zero setting being performed. |
  | close | | Close de connection. |
