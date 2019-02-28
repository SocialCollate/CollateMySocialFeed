(function () {
    'use strict';

    angular
        .module('eventsjs')
        .controller('eventsUpdateCtrl', control);

    control.$inject = [
        '$state',
        'eventsSrvc',
        'accountsSrvc'
        ];
    
    function control(
        $state,
        eventsSrvc,
        accountsSrvc
    ) {
        var vm = angular.extend(this, {
            
         });

        // TODO: Error Handling
        eventsSrvc.updateEvents().then(function(){
            $state.go('posts_list');
        });    
    }
})();
