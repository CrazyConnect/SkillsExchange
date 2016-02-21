'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('myBookings', MyBookings);

function MyBookings() {
    var directive = {
        restrict: 'EA',
        scope: {
            isPrestationMode: '&prestationMode'
        },
        templateUrl: 'scripts/directives/dashboard/my-bookings/my-bookings.html',
        controller: MyBookingsController,
        controllerAs: 'vm',
        bindToController: true // because the scope is isolated
    };

    return directive;
}

MyBookingsController.$inject = ['currentUserService'];

function MyBookingsController(currentUserService) {
    var vm = this;

    vm.bookings = [];

    activate();

    /////////////////

    function activate() {
        currentUserService.getBookingList().then(function (bookings) {
            vm.bookings = bookings;
        });
    }
}