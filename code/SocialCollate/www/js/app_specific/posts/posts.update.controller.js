(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('postsUpdateCtrl', control);

    control.$inject = [
        '$state',
        'postsSrvc'
        ];
    
    function control(
        $state,
        postsSrvc
    ) {
        var vm = angular.extend(this, {
            
         });

        // TODO: Error Handling
        console.log("UPDATE POSTS");
        postsSrvc.updatePosts().then(function(result){
            console.log("RESULT RECIEVED: ",result);
            $state.go('posts_list', {posts:result});
        }, function(rejection){
            alert("Error encountered while getting posts: "+rejection);
            $state.go('posts_list');
        });    
    }
})();
