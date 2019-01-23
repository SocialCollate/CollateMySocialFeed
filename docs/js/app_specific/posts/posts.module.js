(function() {
	'use strict';

	angular
		.module('eventsjs', [
		])
        .config(function($stateProvider) {
			$stateProvider
				.state('posts_list', {
					cache: false,
					url: '/posts_list',
					templateUrl: 'js/app_specific/posts/posts.list.html',
                    controller: 'eventsListCtrl as vm'
                })
                .state('posts_update', {
					cache: false,
					url: '/posts_update',
					templateUrl: 'js/app_specific/posts/posts.update.html',
                    controller: 'eventsUpdateCtrl as vm'
                })
                .state('posts_detail', {
					cache: false,
					url: '/posts_detail',
                    templateUrl: 'js/app_specific/posts/posts.detail.html',
                    params: {'selected': 0 },
                    controller: 'eventsDetailCtrl as vm'
                })
            });
				
})();