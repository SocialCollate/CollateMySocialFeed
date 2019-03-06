(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('eventsUpdateCtrl', control);

    control.$inject = [
        '$state',
        'postsSrvc',
        'accountsSrvc'
        ];
    
    function control(
        $state,
        postsSrvc,
        accountsSrvc
    ) {
        var vm = angular.extend(this, {
            
         });

        // TODO: Error Handling
        postsSrvc.updatePosts().then(function(result){
            console.log("RESULT RECIEVED: ",result);
            $state.go('posts_list', result);
        }, function(rejection){
            alert("Error encountered while getting posts: "+rejection);
            $state.go('posts_list');
        });    
    }
})();
