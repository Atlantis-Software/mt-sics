var mocha = require('mocha');
var fs = require('fs');
var path = require('path');
var test = new mocha({
  bail: false,
  reporter: 'spec',
  timeout: 200
});

fs.readdirSync(__dirname).filter(function(file) {
  return file.substr(-7) === 'Test.js';
}).forEach(function(file) {
  test.addFile(path.join(__dirname, file));
});

var runner = test.run(function(err) {
  if (err) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});

runner.on('fail', function(e) {
  console.error(e.err);
});

