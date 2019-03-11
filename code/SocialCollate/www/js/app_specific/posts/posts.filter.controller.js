(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('postsFilterCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'postsSrvc',
        'accountsSrvc'
        ];
    
    function control(
        $state,
        $stateParams,
        postsSrvc,
        accountsSrvc
    ) {
       
        var vm = angular.extend(this, {
            
        });


        vm.search = function(){
            $state.go('posts_list', {search:getSearch()});
        }


    }
})();
