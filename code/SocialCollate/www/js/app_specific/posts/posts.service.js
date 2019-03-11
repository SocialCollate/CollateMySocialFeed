(function () {
    'use strict';

    angular
        .module('postsjs')
        .factory('postsSrvc', postsSrvc);

    postsSrvc.$inject = [
        '$q', // promises service
        '$timeout', // timeout service
        'accountsSrvc', //accounts service.
        'settingsSrvc'
    ];

    function postsSrvc(
        $q,
        $timeout,
        accountsSrvc,
        settingsSrvc
    ) {

        var service = {

        };

        let postsArray = [];
        let user_settings = settingsSrvc.getUserSettings();

        service.get_all_posts = async function (options, callback) {
            user_settings = settingsSrvc.getUserSettings();
            postsArray = [];
            console.log("USER SETTINGS: ", user_settings);
            if (!options) options = user_settings;

            let num_post_per_account = options.max_posts_per_account;
            let num_posts = options.max_posts_total;
            let accounts = accountsSrvc.getEnabledAccounts();
            let service_mapping = accountsSrvc.service_mapping;
            let account;
            let platform_name;
            let platform_service;
            console.log(accounts.length + " accounts detected. ");
            console.log(num_posts);
            //for each account
            for (let a = 0; a < accounts.length; a++) {
                //get posts from that account
                account = accounts[a];
                platform_name = account.platform_name;
                platform_service = service_mapping[platform_name];

                console.log("PLATFORM SERVICE: ", platform_service);

                await platform_service.getPosts(account, num_post_per_account, function (posts) {
                    console.log("POSTS iterating: ", posts);
                    for (let p = 0; p < posts.length; p++) {
                        console.log("adding post: ",posts[p]);
                        postsArray.push(posts[p]);
                    }
                });

            }

            //cut old posts, leaving {num_posts} remaining posts
            postsArray.splice(num_posts);

            console.log("posts.service.js: ",postsArray);

            //return 
            callback(angular.copy(postsArray));
        }

        service.getNumPosts = function () {
            return postsArray.length;
        }


        service.getPostAt = function (index) {
            return angular.copy(postsArray[index]);
        }
        let wait_time = 3000;
        var getAllPosts = function () {
            var deferred = $q.defer();

            let result = [];
            service.get_all_posts(null, function (posts) {
                console.log("POSTS RECIEVED: ", posts);
                result = posts;
                postsArray = posts;
            });

            $timeout(
                function () {
                    deferred.resolve(result);
                },
                wait_time);


            return deferred.promise;
        }

        var promiseToUpdatePosts = function () {
            // returns a promise
            return getAllPosts();
        }

        service.updatePosts = async function () {
            return promiseToUpdatePosts();
        }

        service.getPosts = function () {
            return angular.copy(postsArray);

        }


        return service;

    }


})();