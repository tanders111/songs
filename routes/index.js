var express = require('express');
var path = require('path');
var fs = require('fs');
var url = require('url');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/song/:name', function(req, res, next) {

  //var u = url.parse(req.path, true); //from request
  var name = req.params.name;
  console.log(name);
	//var parsed = parse(name);
	var lines = getSongLines(name);
  //lines.name = name;
  var rv =  {lines: lines, name: name};
	res.json(rv);
  	//res.json(parsed);
});

router.get('/songs', function(req, res, next) {
	var songs = [];
	var files = fs.readdirSync(home);
	for (var i = 0; i < files.length; i++) {
	  var f = files[i];
	  //var title = f.replace("\\", "/");
	  var title = f.replace(".txt", "");
	  var song = {
                    Title : title,
                    Artist : "",
                    File : f,
                    SearchTokens : getSearchTokens(f)
                };
		songs.push(song);
	}
	//console.log(songs);
	res.json(songs);
});

module.exports = router;

router.get('/tmp/:file', function(req, res, next) {

   var txt = fs.readFileSync('views/error.jade');
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write(txt);
   res.end();

});

function getSearchTokens(fileName) {
  var songPath = path.join(home, fileName);
  var txt = fs.readFileSync(songPath, 'utf8');
  txt = txt.replace( /\n/g, "^^^" ).replace( /\r/g, "" );
  var r = {searchTokens : []};
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
//var home = "C:/doc/home/music/songs/input";
var home = 'files';

var getSongLines = function(song)
{
	var song = path.join(home, song);
	var txt = fs.readFileSync(song, 'utf8');
  //get rid of newlines and split into an array
	var lines = txt.replace( /\n/g, "^^^" ).replace( /\r/g, "" ).split( "^^^" );

  return lines;
}
