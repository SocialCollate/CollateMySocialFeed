(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('postsListCtrl', control);

    control.$inject = [
        '$state',
        'accountsSrvc',
        'postsSrvc',
    ];

    function control(
        $state,
        accountsSrvc,
        postsSrvc,
    ) {
        var vm = angular.extend(this, {
            posts: []
        });

        vm.accountList = function(){
            $state.go('accounts_list');
        }
        vm.update = function () {
            $state.go('posts_update');
        }
        vm.getLogo = function (platform_name){
            return "img/"+platform_name+".png";
        }

        vm.posts = postsSrvc.getPosts();
        console.log("TEST: ",vm.posts, postsSrvc.getPosts());
    }


})();
