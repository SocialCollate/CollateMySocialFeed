(function () {
    'use strict';

    angular
        .module('eventsjs')
        .controller('eventsListCtrl', control);

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
        

        
        vm.onItemSelected = function(index){
            console.log("Item : " + index);

            // we're passing parameters into the new state
            // 'selected is an attribute in a parameter object, defined in the module definition
            // I'm going to write the destination controller, so it knows to look for an object with a 'selected' attribute
            $state.go('posts_detail', {selected: index});


        }
        /*LOGIN FB*/ 
        vm.FBLogin = function(){
            $cordovaOauth.facebook("954844384905992", ["user_posts"]).then(function(result) {
                // results
                console.log(result.access_token);
            }, function(error) {
                // error
                console.log("facebook login attempt failed: "+error);
            });
        }

        vm.noEvents = function(){
            return vm.events.length == 0;
        }

        vm.update = function(){
            $state.go('posts_update');
        }


        vm.events = eventsSrvc.getEvents();
              
    }
})();
