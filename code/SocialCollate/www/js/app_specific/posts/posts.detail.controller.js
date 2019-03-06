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
        var vm = angular.extend(this, {
            post : {
                name: "no name",
                timestamp: new Date(),
                title : "no title"
            }
         });

        vm.done = function(){
            $state.go('posts_list');
        }

        var params = $stateParams;

        vm.post = postsSrvc.getPostAt(params.selected);

    }
})();
