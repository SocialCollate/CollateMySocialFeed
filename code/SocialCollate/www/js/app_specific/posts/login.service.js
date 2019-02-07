(function () {
    'use strict';

    angular
        .module('eventsjs')
        .controller('postsFilterCtrl', control);

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
                console.log(result.access_token);

                //search by account_num

            }, function(error) {
                // error
                console.log("facebook login attempt failed: "+error);
            });
        }

        vm.InstaLogin = function(){
            $cordovaOauth.instagram("954844384905992", ["user_posts"]).then(function(result) {
                // results
                console.log(result.access_token);
            }, function(error) {
                // error
                console.log("facebook login attempt failed: "+error);
            });
        }

        /*OTHER LOGIN HERE*/




              
    }
})();
