(function () {
    'use strict';

    angular
        .module('postsjs')
        .factory('postsSrvc', postsSrvc);

    postsSrvc.$inject = [
        '$q', // promises service
        '$timeout', // timeout service
        'moment', // does dates really well
        'accountsSrvc' //accounts service.
    ];

    function postsSrvc(
        $q,
        $timeout,
        moment,
        accountsSrvc
    ) {

        var service = {

        };
        service.POSTS = [];

        service.getAllPosts = function (options) {
            if (!options) options = USER_SETTINGS;

            let num_posts = options.num_posts;
            let accounts = accountsSrvc.getEnabledAccounts();
            let service_mapping = accountsSrvc.service_mapping;

            //for each account
            for (let a = 0; a < accounts.length; a++) {
                //get posts from that account
                let account = accounts[a];
                let platform_name = account.platform_name;
                let platform_service = service_mapping[platform_name];

                platform_service.getPosts(account, num_posts, function (posts) {
                    for (let p = 0; p < posts.length; p++) {
                        service.POSTS.push(posts[p]);
                    }
                });

            }

            //sort posts by date 
            service.POSTS = service.POSTS.sort(function (x, y) { return (x.when.getTime() - y.when.getTime()) });

            //cut old posts, leaving {num_posts} remaining posts
            service.POSTS.splice(num_posts - 1);

            //return 
            return angular.copy(service.POSTS);
        }

        service.getNumPosts = function () {
            return service.POSTS.length;
        }

        service.getPostAt = function (index) {
            return angular.copy(service.POSTS[index]);
        }
        let timeout_time = 1000;
        var getAllPosts = function () {
            var deferred = $q.defer();
    
            $timeout(
                function () {
                    let posts = service.getAllPosts();
                    deferred.resolve(posts);
                },
                timeout_time);
    
    
            return deferred.promise;
        }
    
        var promiseToUpdatePosts = function () {
            // returns a promise
            return getAllPosts();
        }
    
        service.updatePosts = function () {
            return promiseToUpdatePosts();
        }


        return service;

    }


})();