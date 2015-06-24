(function() {
  var expected, fs, output;

  fs = require("fs");

  output = fs.readFileSync("output.html", "utf8");

  expected = fs.readFileSync("expected_output.html", "utf8");

  if (output === expected) {
    console.log("Congratulations, looks like you have it working ;)");
  } else {
    console.log("Not quite there yet, keep at it.");
  }

}).call(this);
