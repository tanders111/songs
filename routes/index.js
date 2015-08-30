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
	var parsed = parse(name);
  	res.json(parsed);
});

router.get('/songs', function(req, res, next) {
	var home = "C:/doc/home/music/songs/input";
	var songs = [];
	var files = fs.readdirSync(home);
	for (var i = 0; i < files.length; i++) {
	  var f = files[i];
	  //var title = f.replace("\\", "/");
	  var title = f.replace(".txt", "");
	  var song = {
                    Title : title,
                    Artist : "",
                    File : f
                };
		songs.push(song);
	}
	//console.log(songs);
	res.json(songs);
});

module.exports = router;

var parse = function(song)
{
	var home = "C:/doc/home/music/songs/input";
	var song = path.join(home, song);
	var txt = fs.readFileSync(song, 'utf8');

	var maxLines = 70;
	var parsed = {};
	parsed.FileName = path.Name;
	var isheader = true;
	var header = [];
	var blocks = [];
	var currentBlock = [];
	blocks.push(currentBlock);
	var lines = txt.replace( /\n/g, "^^^" ).replace( /\r/g, "" ).split( "^^^" );

	var idx = 0;
	while (idx < lines.length && !(lines[idx].indexOf("@quit") ===0)) {
		var line = lines[idx];
	   if (line && line.trim) {
       line = line.trim();
     } 

		if (isheader) {
			if (line.indexOf("---") === 0) {
				isheader = false;
			} else {
				header.push(line);
			}
		} else {
			var br = line.indexOf("@br") > -1;
			if (br || currentBlock.length === maxLines) {
				currentBlock = [];
				blocks.push(currentBlock);
			}
			if (!br) currentBlock.push(line);
		}
		idx++;
	}
	parsed.Header = header;
	parsed.Blocks = blocks;
	return parsed;
}
