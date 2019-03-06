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

        service.getAllPosts = async function (options, callback) {
            service.POSTS = [];
            console.log("USER SETTINGS: ", USER_SETTINGS);
            if (!options) options = USER_SETTINGS;

            let num_posts = options.max_posts_per_account;
            let accounts = accountsSrvc.getEnabledAccounts();
            let service_mapping = accountsSrvc.service_mapping;
            console.log(accounts.length+" accounts detected. ");
            //for each account
            for (let a = 0; a < accounts.length; a++) {
                //get posts from that account
                let account = accounts[a];
                let platform_name = account.platform_name;
                let platform_service = service_mapping[platform_name];

                console.log("PLATFORM SERVICE: ",platform_service);

                await platform_service.getPosts(account, num_posts, function (posts) {
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
            callback(service.POSTS);
        }

        service.getNumPosts = function () {
            return service.POSTS.length;
        }

        service.getPostAt = function (index) {
            return angular.copy(service.POSTS[index]);
        }
        let wait_time = 1000;
        var getAllPosts = function () {
            console.log
            var deferred = $q.defer();

            $timeout(
                function () {
                    service.getAllPosts(null,function(posts){
                        console.log("POSTS RECIEVED: ",posts);
                        deferred.resolve(posts);
                    });
                },
                wait_time);
    
    
            return deferred.promise;
        }
    
        var promiseToUpdatePosts = function () {
            // returns a promise
            return getAllPosts(USER_SETTINGS);
        }
    
        service.updatePosts = function () {
            return promiseToUpdatePosts();
        }


        return service;

    }


})();