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
    $scope.showSong(songList[0].File);
  });

  $scope.showSong = function(fileName) {

    $scope.currentSong = fileName;
    var config = { /*params: { name: fileName } */ };

    $http.get('song/' + fileName, config).success(function(data) {
      var blocks = data.Blocks;
      $scope.block0 = blocks[0] ? blocks[0].join('\r\n') : "";
      $scope.block1 = blocks.length > 1 ? blocks[1].join('\r\n') : "";
      $scope.header = data.Header.join('\r\n');
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
  $scope.$watch('titleFilter', filterSongs);
  
});
