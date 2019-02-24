(function () {
    'use strict';

    angular
        .module('eventsjs')
        .controller('accountsListCtrl', control);

    control.$inject = [
        '$state',
        '$cordovaOauth',
        'eventsSrvc',
        'accountsSrvc'
        ];
    
    function control(
        $state,
        $cordovaOauth,
        eventsSrvc,
        accountsSrvc
    ) {
        var vm = angular.extend(this, {
            accounts : []
         });
        
         vm.ACCOUNTS = accountsSrvc.getAccounts();
         console.log("loaded accounts"+vm.ACCOUNTS.length);
         
        
        vm.capitalise = function(string){
            return (string[0].toUpperCase()+string.substring(1));
        }
        

        vm.noAccounts = function(){
            return vm.accounts.length == 0;
        }

        vm.update = function(){
            console.log("ohh");
            $state.go('posts_update');
        }

        vm.addAccount = function(){
            $state.go('accounts_add');
        }


        vm.deleteAllAccounts = function(){
            vm.accounts = accountsSrvc.deleteAllAccounts();
        }
        //Confirm dialogue 




        vm.events = eventsSrvc.getEvents();
              
    }






})();
