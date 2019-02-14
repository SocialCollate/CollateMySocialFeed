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
            events : []
        });

        

        /*LOGIN FB*/ 
        vm.FBLogin = function(account){
            $cordovaOauth.facebook("954844384905992", ["user_posts"]).then(function(result) {
                // results
                account.access_token = result.access_token;
                account.expiry = result.expires;
                account.time_created = Date.now();
                storeAccount(account)

                //search by account_num

            }, function(error) {
                // error
                console.log("facebook login attempt failed: "+error);
            });
        }
        /*TWITTER 
        vm.TwitterLogin = function(){

            $cordovaOauth.twitter("954844384905992", ["user_posts"]).then(function(result) {
                // results
                console.log(result.access_token);
            }, function(error) {
                // error
                console.log("facebook login attempt failed: "+error);
            });
        }
        */

       vm.InstaLogin = function () {
        $cordovaOauth.instagram("f2ba7a4402984ae9b41e9913226e65a6", ["basic"]).then(function (result) {
            // results
            var account = {
                access_token:result.access_token,
                expiry:result.expires,
                time_created:Date.now()
            }
            /*
            account.access_token = result.access_token;
            account.expiry = result.expires;
            account.time_created = Date.now();
            */
            storeAccount(account);

            console.log(account);

            //search by account_num

        }, function (error) {
            // error
            console.log("Instagram login attempt failed: " + error);
        });
    }
        
              
    }
})();
