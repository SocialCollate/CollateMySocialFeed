(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('eventsDetailCtrl', control);

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
       

        vm.search = function(){
            $state.go('posts_list');
        }


    }
})();
