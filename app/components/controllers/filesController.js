/**
 * Main goes here
 */
//declaring the about module and controller
angular
  .module('FilesController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('FilesController', ['$scope', '$q', '$timeout', 'HashFactory', 'PublishService', 'FileFactory', 'IpfsService', FilesController]);

function FilesController($scope, $q, $timeout, HashFactory, PublishService, FileFactory, IpfsService) {
  //start local Daemon
  const self = this;
  // Dispersion.startDaemon()
  //get Username of local user. Used for file saving
  username().then(username => {
    self.username = username;
  });

  self.files;
  //gets all of the users pinned hashes
  HashFactory.loadFilesFromStorage($scope);

  //shows additional info about pinned file
  self.showInfo = function (index) {
    $(`#sel-option${index}`).show();
  }

  self.addHash = function () {
    dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }, function (addFiles) {
      IpfsService.addFile(addFiles[0]);
      $timeout(() => {
        self.files = HashFactory.loadFilesFromStorage($scope)
      }, 1000)
    });
  }

  self.deleteHash = function (hash) {
    IpfsService.unPin(hash);
    $scope.files = HashFactory.loadFilesFromStorage($scope)
  }

  self.saveToDisk = function (hash, username) {
    IpfsService.saveToDisk(hash, username);
  }

  self.addToPublish = function (value) {
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
    self.publishObject = data;
  })
  console.log("Instant Log: " + $scope.publishArray);

  self.publisher = function (hash) {
    console.log(hash)
    IpfsService.publish(hash)
  }

  // FileFactory.init();  
  //Add project from local file system to electron app system
  // $scope.addProject = FileFactory.copyProject();

}