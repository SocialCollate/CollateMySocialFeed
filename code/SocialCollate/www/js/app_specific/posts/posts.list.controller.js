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
            events: []
        });

        vm.accountList = function(){
            $state.go('accounts_list');
        }

        vm.update = function () {
            $state.go('posts_update');
        }

    }


})();
