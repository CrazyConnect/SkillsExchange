'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope,$position, currentUserService) {
    currentUserService.getBookingList().then(function (bookings) {
      $scope.bookings = bookings;
    })


  });
