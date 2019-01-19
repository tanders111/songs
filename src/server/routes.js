const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

var home = '/Users/Todd/Documents/music/songs'; //'files';

router.get('/songs/:name', function (req, res, next) {

  //var u = url.parse(req.path, true); //from request
  var name = req.params.name;
  
  var lines = getSongLines(name);

  var rv = { lines: lines, name: name };
  res.json(rv);

});

router.get('/songs', function (req, res, next) {
  var songs = [];
  
  var files = fs.readdirSync(home);
  for (var i = 0; i < files.length; i++) {
    var f = files[i];

    var title = f.replace(".txt", "");
    var song = {
      title: title,
      artist: "",
      file: f,
      searchTokens: getSearchTokens(f)
    };
    songs.push(song);
  }
  
  res.json(songs);
});

function getSearchTokens(fileName) {
  var songPath = path.join(home, fileName);
  var txt = fs.readFileSync(songPath, 'utf8');
  txt = txt.replace(/\n/g, "^^^").replace(/\r/g, "");
  var r = { searchTokens: [] };
  var res = txt.split(" ");

  for (var i in res) {
    var x = res[i].trim().toLowerCase();
    if (!r[x] && x.length > 2) {
      r[x] = 1;
      r.searchTokens.push(x);
    }
  }
  return r.searchTokens;
}

var getSongLines = function (song) {
  var song = path.join(home, song);
  var txt = fs.readFileSync(song, 'utf8');
  //get rid of newlines and split into an array
  var lines = txt.replace(/\n/g, "^^^").replace(/\r/g, "").split("^^^");

  return lines;
}

module.exports = router;