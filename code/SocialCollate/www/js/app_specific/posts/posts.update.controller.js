(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('eventsUpdateCtrl', control);

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
            
         });

        // TODO: Error Handling
        postsSrvc.updateEvents().then(function(){
            $state.go('posts_list');
        });    
    }
})();
