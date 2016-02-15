var songApp = angular.module('songApp', ['ui.bootstrap']);

songApp.controller('SongListCtrl', function($scope, $http) {

  $scope.songs = [];
  $scope.header = 'select a song';

  var config = { /*params: {}*/ };

  $http.get('songs', config).success(function(data) {
    var songList = data;
    $scope.allSongs = songList.concat();

    songList.sort(function(a, b) {
      return a.Title.localeCompare(b.Title)
    });
    $scope.songs = songList;

    var initial = localStorage.getItem("lastSong");

    for (var idx in $scope.songs) {
      if ($scope.songs[idx].File == initial) var found = initial;
    }

    if (!found) found = songList[0].File;

    $scope.showSong(found);
  });

  $scope.showSong = function(fileName) {
    localStorage.setItem("lastSong", fileName);
    $scope.currentSong = fileName;
    var config = { /*params: { name: fileName } */ };

    $http.get('song/' + fileName, config).success(function(data) {
      $scope.unparsed = data;
      var parsed = parse(data);
      var blocks = parsed.Blocks;
      $scope.block0 = blocks[0] ? blocks[0].join('\r\n') : "";
      $scope.block1 = blocks.length > 1 ? blocks[1].join('\r\n') : "";
      $scope.header = parsed.Header.join('\r\n');
      $scope.singlePage = blocks.length === 1 && parsed.Header.length + blocks[0].length < 77;
    });

  }

  var filterSongs = function(newVal, oldVal) {
    if ($scope.allSongs) {
      $scope.songs = [];
      for (var i = 0; i < $scope.allSongs.length; i++) {
        var s = $scope.allSongs[i].Title.toLowerCase();

        if ((!newVal || newVal.length === 0) || s.indexOf(newVal.toLowerCase()) != -1) {
          $scope.songs.push($scope.allSongs[i]);
        }

      }

    }
  }
  var parse = function(data)
  {
    lines = data.lines;
  	var maxLines = 70;
  	var parsed = {};
  	parsed.FileName = data.name;//path.Name;
  	var isheader = true;
  	var header = [];
  	var blocks = [];
  	var currentBlock = [];
  	blocks.push(currentBlock);

  	var idx = 0;
  	while (idx < lines.length && !(lines[idx].indexOf("@quit") ===0)) {
  		var line = lines[idx];
  	   if (line && line.trim) {
         //trim line to the right
         line = line.replace(/~+$/, '');
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

  $scope.$watch('titleFilter', filterSongs);

});
