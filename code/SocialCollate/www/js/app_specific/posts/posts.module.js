(function() {
	'use strict';

	angular
		.module('postsjs', [
		])
        .config(function($stateProvider) {
			$stateProvider
				.state('posts_list', {
					cache: false,
					url: '/posts_list',
					params : {posts:[]},
					templateUrl: 'js/app_specific/posts/posts.list.html',
                    controller: 'postsListCtrl as vm'
                })
                .state('posts_update', {
					cache: false,
					url: '/posts_update',
					templateUrl: 'js/app_specific/posts/posts.update.html',
                    controller: 'postsUpdateCtrl as vm'
                })
                .state('posts_detail', {
					cache: false,
					url: '/posts_detail',
                    templateUrl: 'js/app_specific/posts/posts.detail.html',
                    params: {selected: 0 },
                    controller: 'eventsDetailCtrl as vm'
				})
				.state('posts_filter', {
					cache: false,
					url: '/posts_filter',
                    templateUrl: 'js/app_specific/posts/posts.detail.html',
                    controller: 'postsFilterCtrl as vm'
				})
				.state('accounts_list', {
					cache: false,
					url: '/accounts_list',
					templateUrl: 'js/app_specific/posts/accounts.list.html',
					params: {accounts: []},
                    controller: 'accountsListCtrl as vm'
				})
				.state('accounts_add', {
					cache: false,
					url: '/accounts_add',
                    templateUrl: 'js/app_specific/posts/accounts.add.html',
                    controller: 'accountsAddCtrl as vm'
				})
				.state('account_detail', {
					cache: false,
					url: '/account_detail',
                    templateUrl: 'js/app_specific/posts/accounts.detail.html',
					params: {accounts: [], selected : 0 },
                    controller: 'accountDetailCtrl as vm'
				})
            });
				
})();