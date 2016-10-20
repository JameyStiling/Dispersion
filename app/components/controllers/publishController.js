angular
  .module('PublishController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('PublishController', ['PublishService', PublishController]);

function PublishController(PublishService) {
  PublishService.init().then(console.log('init called in publish controller'))
  const self = this;
  self.data = PublishService.data;
}