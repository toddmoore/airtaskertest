(function() {
  var data, fs, html, solution;

  fs = require("fs");

  solution = require("./solution");

  data = JSON.parse(fs.readFileSync("activity_feed.json"));

  html = solution.generateActivityList(data);

  fs.writeFileSync("output.html", html, "utf8");

}).call(this);
