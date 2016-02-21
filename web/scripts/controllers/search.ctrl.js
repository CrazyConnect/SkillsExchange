'use strict';

angular.module('sbAdminApp')
.controller('SearchCtrl', SearchCtrl);

SearchCtrl.$inject = ['serviceService'];

function SearchCtrl(serviceService) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
        serviceService.getList().then(function (services) {
            console.log(JSON.stringify(services));
            vm.services = services;
        })
    }
}
