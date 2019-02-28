(function () {
    'use strict';

    angular
        .module('eventsjs')
        .controller('eventsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'eventsSrvc',
        'accountsSrvc'
        ];
    
    function control(
        $state,
        $stateParams,
        eventsSrvc
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

        vm.post = eventsSrvc.getPostAt(params.selected);

        

    }
})();
