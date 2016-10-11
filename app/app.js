const app = angular.module('myApp', ['directives', 'HashFactory'])
  .controller('DashboardController', function($scope, $q, $timeout, HashFactory) {

    //gets all of the users pinned hashes
    HashFactory.init().then(function(fileArray) {
      $scope.files = HashFactory.fileget(fileArray);
    });

    //shows additional info about pinned file
    $scope.showInfo = function(index) {
      $(`#sel-option${index}`).show();
    }

    $scope.newFile;
    $scope.addHash = function() {
      //function in renderer.js that adds file or directory to local ipfs node
      submitFile($scope.newFile);

      $timeout(function() {
        console.log("just entered", $scope.files);
        HashFactory.init().then(function(fileArray) {
          console.log(fileArray)
          $scope.files = HashFactory.fileget(fileArray);
          window.location.reload()
        })
      }, 1000);
    }

    $scope.deleteHash = function(hash) {
      unPin(hash);
      window.location.reload()
    }

  })