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
        postsSrvc.updatePosts().then(function(posts){
            console.log("posts.update.controller: ",posts);
            $state.go('posts_list', {posts});
        }, function(error){
            alert("Error encountered while getting posts: "+error);
            $state.go('posts_list');
        });   
    }
})();
