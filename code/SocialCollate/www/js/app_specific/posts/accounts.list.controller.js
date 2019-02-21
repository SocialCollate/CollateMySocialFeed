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
        eventsSrvc
    ) {
        var vm = angular.extend(this, {
            accounts : []
         });
        

        
        vm.onItemSelected = function(index){
            console.log("Item : " + index);

            // we're passing parameters into the new state
            // 'selected is an attribute in a parameter object, defined in the module definition
            // I'm going to write the destination controller, so it knows to look for an object with a 'selected' attribute
            $state.go('posts_detail', {selected: index});


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



        vm.events = eventsSrvc.getEvents();
              
    }
})();
