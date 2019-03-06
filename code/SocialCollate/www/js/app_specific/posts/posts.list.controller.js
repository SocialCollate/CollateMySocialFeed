(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('postsListCtrl', control);

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
            POSTS : []
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
            vm.POSTS = $state.params.posts;


    }


})();
