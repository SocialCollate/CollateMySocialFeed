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
            accounts:[]
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
        vm.goBack = function(){
            $state.go("accounts_list", {accounts:$state.params.accounts});
        }

        //get account from params
        vm.account = $state.params.accounts[$state.params.selected];

        vm.account_keys = Object.keys(vm.account);


    }
}) ();
