(function () {
    'use strict';

    angular
        .module('eventsjs')
        .controller('accountsListCtrl', control);

    control.$inject = [
        '$state',
        '$cordovaOauth',
        'eventsSrvc'
        ];
    
    function control(
        $state,
        $cordovaOauth,
        eventsSrvc
    ) {
        var vm = angular.extend(this, {
            events : []
        });

        

        /*LOGIN FB*/ 
        vm.FBLogin = function(account){
            $cordovaOauth.facebook("954844384905992", ["user_posts"]).then(function(result) {
                // results
                account.access_token = result.access_token;
                account.expiry = result.expires;
                account.time_created 
                storeAccount(account)

                //search by account_num

            }, function(error) {
                // error
                console.log("facebook login attempt failed: "+error);
            });
        }
        //TWITTER
        vm.TwitterLogin = function(){

            $cordovaOauth.twitter("954844384905992", ["user_posts"]).then(function(result) {
                // results
                console.log(result.access_token);
            }, function(error) {
                // error
                console.log("facebook login attempt failed: "+error);
            });
        }

        vm.events = eventsSrvc.getEvents();
              
    }
})();
