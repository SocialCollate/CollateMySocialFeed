(function () {
    'use strict';

    angular
        .module('eventsjs')
        .controller('accountsListCtrl', control);

    control.$inject = [
        '$state',
        'eventsSrvc',
        'accountsSrvc'
        ];
    
    function control(
        $state,
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

        vm.deleteAccount = function(index){
            let respond = window.confirm("Are you sure you want to delete this account?");
            alert(respond);
        }


        vm.getLogo = function (platform_name){
            console.log("GETTING "+ "img/"+platform_name+".png");
            return "img/"+platform_name+".png";
        }

        vm.showDetail = function (account){
            $state.go('account_detail', {account});
        }

        vm.deleteAllAccounts = function(){
            vm.accounts = accountsSrvc.deleteAllAccounts();
        }
        //Confirm dialogue 





        vm.events = eventsSrvc.getEvents();
              
    }






})();
