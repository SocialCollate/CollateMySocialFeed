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
					params : {posts:[],search:null},
					templateUrl: 'js/app_specific/posts/posts.list.html',
                    controller: 'postsListCtrl as vm'
                })
                .state('posts_update', {
					cache: false,
					url: '/posts_update',
					templateUrl: 'js/app_specific/posts/posts.update.html',
                    controller: 'postsUpdateCtrl as vm'
                })
                .state('post_detail', {
					cache: false,
					url: '/post_detail',
                    templateUrl: 'js/app_specific/posts/posts.detail.html',
                    params: {post:{}},
                    controller: 'postsDetailCtrl as vm'
				})
				.state('posts_filter', {
					cache: false,
					url: '/posts_filter',
                    templateUrl: 'js/app_specific/posts/posts.filter.html',
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
				.state('user_settings', {
					cache: false,
					url: '/user_settings',
                    templateUrl: 'js/app_specific/posts/user.settings.html',
					params: {changes:false,settings:{},set:{}},
                    controller: 'userSettingsCtrl as vm'
				})
				.state('user_settings_change', {
					cache: false,
					url: '/user_settings_change',
                    templateUrl: 'js/app_specific/posts/user.settings.change.html',
					params: {changes:false,settings: {},setting:{},info:{}},
                    controller: 'userSettingsChangeCtrl as vm'
				})
            });
				
})();