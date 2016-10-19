/**
 * Main goes here
 */
//declaring the about module and controller
angular
  .module('DashboardController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('DashboardController', ['$scope', '$q', '$timeout', 'HashFactory', 'PublishService', 'FileFactory', 'IpfsService', DashboardController]);

function DashboardController($scope, $q, $timeout, HashFactory, PublishService, FileFactory, IpfsService) {
  //start local Daemon
  
  // Dispersion.startDaemon()
  //get Username of local user. Used for file saving
  username().then(username => {
    $scope.username = username;
  });
  $scope.newFile;


  //gets all of the users pinned hashes
  HashFactory.loadFilesFromStorage($scope);

  //shows additional info about pinned file
  $scope.showInfo = function (index) {
    $(`#sel-option${index}`).show();
  }

  //function in renderer.js that adds file or directory to local ipfs node
  $scope.addHash = function () {
    Dispersion.submitFile($scope.newFile);
    $timeout(() => {
      $scope.files = HashFactory.loadFilesFromStorage($scope)
    }, 1000)
  }

  $scope.deleteHash = function (hash) {
    Dispersion.unPin(hash);
    $scope.files = HashFactory.loadFilesFromStorage($scope)
  }

  $scope.saveToDisk = function (hash, username) {
    Dispersion.saveToDisk(hash, username);
  }

  $scope.addToPublish = function (value) {
    console.log('value in add to publish: \n', value)
    PublishService.add(
      {
        [value.item]:
        [
          {
            'date': value.time,
            'hash': value.hash,
            'publish': false,
            'changed': null,
            'url': value.url,
            'files': value.files
          }
        ]
      });
  }



  /*********************************************************/
  var publishObjectPromise = new Promise(function (resolve, reject) {
    storage.get('publishStorage', function (error, data) {
      if (error) throw error;
      else resolve(data);
    })
  });

  publishObjectPromise.then(function (data) {
    console.log(data);
    $scope.publishObject = data;
  })
  console.log("Instant Log: " + $scope.publishArray);

  $scope.publisher = function (hash) {
    console.log(hash)
    Dispersion.publishHash(hash)
  }

  // FileFactory.init();  
  //Add project from local file system to electron app system
  // $scope.addProject = FileFactory.copyProject();

}