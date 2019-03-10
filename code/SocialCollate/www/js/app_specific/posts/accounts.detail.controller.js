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
            return "img/"+platform_name+".png";
        }
        vm.goBack = function(){
            $state.go("accounts_list", {accounts:$state.params.accounts});
        }
        vm.deleteAccount = function(){
            if (confirm("Are you sure you want to delete this account?\nYou will have to log in if you want to use this account again.")){
                console.log("delete request: ", vm.account);
                if (accountsSrvc.deleteAccount(vm.account)){
                    $state.go("accounts_list");
                }
                else {
                    alert("Error encountered while deleting the account.");
                }
            }
        }

        //get account from params
        vm.account = $state.params.accounts[$state.params.selected];

        vm.account_keys = Object.keys(vm.account);


    }
}) ();
