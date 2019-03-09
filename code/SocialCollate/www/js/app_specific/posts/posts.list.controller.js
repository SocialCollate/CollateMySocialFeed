(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('postsListCtrl', control);

    control.$inject = [
        '$state',
        'accountsSrvc',
        'postsSrvc',
        '$q',
        '$timeout'
    ];

    function control(
        $state,
        accountsSrvc,
        postsSrvc,
        $q,
        $timeout
    ) {
        var vm = angular.extend(this, {
            posts: []
        });

        vm.accountList = function(){
            if (accountsSrvc.performWait()){
                let deferred = $q.defer();
                let wait_time = 1000;
                accountsSrvc.getAccounts();
                //wait to allow account service to get details
                $timeout(
                    function () {
                        $state.go('accounts_list');
                        deferred.resolve();
                    },
                    wait_time);
    
    
                return deferred.promise;
            } else {
                $state.go('accounts_list');
            }
        }
        vm.update = function () {
            $state.go('posts_update');
        }
        vm.getLogo = function (platform_name){
            return "img/"+platform_name+".png";
        }
        vm.showDetail = function (post){
            $state.go("post_detail", {post});
        }

        vm.posts = postsSrvc.getPosts();
        console.log("TEST: ",vm.posts, postsSrvc.getPosts());
    }


})();
