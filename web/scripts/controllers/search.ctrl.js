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

    vm.getRandomAvatar = function(){
        var genderArray = [
            'men',
            'women'
        ];
        var randomNb = Math.floor(Math.random()*genderArray.length);
        return 'https://randomuser.me/api/portraits/med/'+genderArray[randomNb]+'/' + Math.floor((Math.random() * 100) + 1)+'.jpg';
    }
}
