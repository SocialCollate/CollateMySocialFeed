(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('accountDetailCtrl', control);

    control.$inject = [
        '$state',
        'accountsSrvc'
    ];

    function control(
        $state,
        accountsSrvc
    ) {
        var vm = angular.extend(this, {
            
        });

        vm.hideData = true;
        vm.capitalise = function(string){
            return (string[0].toUpperCase()+string.substring(1));
        }
        vm.showAllData = function(){
            vm.hideData = false;
        }
        vm.getLogo = function (platform_name){
            console.log("GETTING "+ "img/"+platform_name+".png");
            return "img/"+platform_name+".png";
        }

        //get account from params
        vm.ACCOUNT = $state.params.account;
        vm.ACCOUNT_KEYS = Object.keys(vm.ACCOUNT);


    }
}) ();
