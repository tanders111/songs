const path = require('path');

console.log('webpack running at dir ' + __dirname);
//const nodeExternals = require('webpack-node-externals');
module.exports = {
  target: "node",
  entry: {
    app: ["./src/server/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle-server.js"
  }
  //uncomment this to exclude node express from the bundle (but then node_modules has to exist)
  //,externals: [nodeExternals()],
};