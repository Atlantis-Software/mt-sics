var assert = require('assert');
var MTSICS = require("../lib/index");

describe('sics 0', function() {

  var mtsics = new MTSICS();

  it('get_commands should parse results', function(done) {
    mtsics.get_commands(function(err, commands) {
      assert.ifError(err);
      assert.deepEqual(commands, [
        { level: 0, command: 'I0' },
        { level: 1, command: 'D' },
        { level: 3, command: 'CLR' }
      ]);
      done();
    });
    
    mtsics.write('I0 B 0 "I0"\r\nI0 B');
    mtsics.write(' 1 "D"\r\nI0 B 3 "CLR"\r\nI0 A\r\n');
  });

  it('get_commands return an error', function(done) {
    mtsics.get_commands(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('I0 I\r\n');
  });

  it('get_mtsics_level should parse results', function(done) {
    mtsics.get_mtsics_level(function(err, mtsics_level) {
      assert.ifError(err);
      assert.deepEqual(mtsics_level, {
        levels: 'x1',
        'sics0_ version': 'x2',
        'sics1_ version': 'x3',
        'sics2_ version': 'x4',
        'sics3_ version': 'x5'      
      });
      done();
    });
    mtsics.write('I1 A "x1" "x2" "x3" "x4" "x5"\r\n');
  });

  it('get_mtsics_level return an error', function(done) {
    mtsics.get_mtsics_level(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('I1 I\r\n');
  });

  it('get_balance_data should parse results', function(done) {
    mtsics.get_balance_data(function(err, balance_data) {
      assert.ifError(err);
      assert.deepEqual(balance_data, {
        data: 'ICS469 OU 60.18 kg'
      });
      done();
    });
    mtsics.write('I2 A "ICS469 OU 60.18 kg"\r\n');
  });

  it('get_balance_data return an error', function(done) {
    mtsics.get_balance_data(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('I2 I\r\n');
  });

  it('get_software_version should parse results', function(done) {
    mtsics.get_software_version(function(err, software_version) {
      assert.ifError(err);
      assert.deepEqual(software_version, {
        software_version: 'aa-bb-cc.cc.cc-dd-e'
      });
      done();
    });
    mtsics.write('I3 A "aa-bb-cc.cc.cc-dd-e"\r\n');
  });

  it('get_software_version return an error', function(done) {
    mtsics.get_software_version(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('I3 I\r\n');
  });

  it('get_serial_number should parse results', function(done) {
    mtsics.get_serial_number(function(err, serial_number) {
      assert.ifError(err);
      assert.deepEqual(serial_number, {
        "serial_number": "1234567"
      });
      done();
    });
    mtsics.write('I4 A "1234567"\r\n');
  });

  it('get_serial_number return an error', function(done) {
    mtsics.get_serial_number(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('I4 I\r\n');
  });

  it('get_weight_stable should parse results', function(done) {
    mtsics.get_weight_stable(function(err, weight_stable) {
      assert.ifError(err);
      assert.deepEqual(weight_stable, {
        "unit": "g",
        "weight": 100
      });
      done();
    });
    mtsics.write('S S     100.00 g\r\n');
  });

  it('get_weight_stable return an error', function(done) {
    mtsics.get_weight_stable(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('S I\r\n');
  });

  it('get_weight_stable return an error: Scale in overload range', function(done) {
    mtsics.get_weight_stable(function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, 'Scale in overload range');
      done();
    });
    mtsics.write('S +\r\n');
  });

  it('get_weight_stable return an error: Scale in underload range', function(done) {
    mtsics.get_weight_stable(function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, 'Scale in underload range');
      done();
    });
    mtsics.write('S -\r\n');
  });

  it('get_weight should parse dynamic results', function(done) {
    mtsics.get_weight(function(err, weight) {
      assert.ifError(err);
      assert.deepEqual(weight, {
        "dynamic_weight": 129.07,
        "unit": "g"
      });
      done();
    });
    mtsics.write('S D     129.07 g\r\n');
  });

  it('get_weight should parse stable results', function(done) {
    mtsics.get_weight(function(err, weight) {
      assert.ifError(err);
      assert.deepEqual(weight, {
        "stable_weight": 129.07,
        "unit": "g"
      });
      done();
    });
    mtsics.write('S S     129.07 g\r\n');
  });

  it('get_weight return an error', function(done) {
    mtsics.get_weight(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('S I\r\n');
  });

  it('get_weight return an error: Scale in overload range', function(done) {
    mtsics.get_weight(function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, 'Scale in overload range');
      done();
    });
    mtsics.write('S +\r\n');
  });

  it('get_weight return an error: Scale in underload range', function(done) {
    mtsics.get_weight(function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, 'Scale in underload range');
      done();
    });
    mtsics.write('S -\r\n');
  });

  it('zero_stable should parse results', function(done) {
    mtsics.zero_stable(function(err, zero) {
      assert.ifError(err);
      assert.equal(zero, "Command executed successfully");
      done();
    });
    mtsics.write('Z A\r\n');
  });

  it('zero_stable return an error', function(done) {
    mtsics.zero_stable(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('Z I\r\n');
  });

  it('zero_stable return an error: Upper limit of zero setting range exceeded', function(done) {
    mtsics.zero_stable(function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, 'Upper limit of zero setting range exceeded');
      done();
    });
    mtsics.write('Z +\r\n');
  });

  it('zero_stable return an error: Lower limit of zero setting range exceeded', function(done) {
    mtsics.zero_stable(function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, 'Lower limit of zero setting range exceeded');
      done();
    });
    mtsics.write('Z -\r\n');
  });

  it('zero should parse dynamic results', function(done) {
    mtsics.zero(function(err, zero) {
      assert.ifError(err);
      assert.equal(zero, "Zero setting performed under dynamic conditions");
      done();
    });
    mtsics.write('ZI D\r\n');
  });

  it('zero should parse stable results', function(done) {
    mtsics.zero(function(err, zero) {
      assert.ifError(err);
      assert.equal(zero, "Zero setting performed under stable conditions");
      done();
    });
    mtsics.write('ZI S\r\n');
  });

  it('zero return an error', function(done) {
    mtsics.zero_stable(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('Z I\r\n');
  });

  it('zero return an error: Upper limit of zero setting range exceeded', function(done) {
    mtsics.zero_stable(function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, 'Upper limit of zero setting range exceeded');
      done();
    });
    mtsics.write('Z +\r\n');
  });

  it('zero return an error: Lower limit of zero setting range exceeded', function(done) {
    mtsics.zero_stable(function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, 'Lower limit of zero setting range exceeded');
      done();
    });
    mtsics.write('Z -\r\n');
  });

  it('reset should parse results', function(done) {
    mtsics.reset(function(err, reset) {
      assert.ifError(err);
      assert.deepEqual(reset, {
        "serial_number": "1234567"
      });
      done();
    });
    mtsics.write('IA A "1234567"\r\n');
  });

  it('reset return an error', function(done) {
    mtsics.reset(function(err) {
      assert(err instanceof Error);
      done();
    });
    mtsics.write('IA I\r\n');
  });

});
