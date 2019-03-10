(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('postsListCtrl', control);

    control.$inject = [
        '$state',
        'accountsSrvc',
        'postsSrvc',
        '$q',
        '$timeout'
    ];

    function control(
        $state,
        accountsSrvc,
        postsSrvc,
        $q,
        $timeout
    ) {
        var vm = angular.extend(this, {
            posts: []
        });

        vm.accountList = function () {
            if (accountsSrvc.performWait()) {
                let deferred = $q.defer();
                let wait_time = 1000;
                accountsSrvc.getAccounts();
                //wait to allow account service to get details
                $timeout(
                    function () {
                        $state.go('accounts_list');
                        deferred.resolve();
                    },
                    wait_time);


                return deferred.promise;
            } else {
                $state.go('accounts_list');
            }
        }
        vm.update = function () {
            $state.go('posts_update');
        }
        vm.getLogo = function (platform_name) {
            return "img/" + platform_name + ".png";
        }
        vm.showDetail = function (post) {
            $state.go("post_detail", { post });
        }
        vm.formatDate = function (date) {
            let today = new Date();

            let now = Math.floor(today.getTime() / 1000);
            let then = Math.floor(date.getTime() / 1000);

            let diff = now - then;

            if (diff > (60 * 60 * 24 * 365.25)) {
                //1 year or more ago
                if (Math.floor(diff / (60 * 60 * 24 * 365.25)) == 1) return "1 year ago";
                else return (Math.floor(diff / (60 * 60 * 24 * 365.25))) + " years ago";
            }
            else if (diff > (60 * 60 * 24 * 30)) {
                //1 month or more ago
                if (Math.floor(diff / (60 * 60 * 24 * 30)) == 1) return "1 month ago";
                else return (Math.floor(diff / (60 * 60 * 24 * 30))) + " months ago";
            }
            else if (diff > (60 * 60 * 24)) {
                console.log(diff, 60 * 60 * 24);
                //1 day or more ago
                if (Math.floor(diff / (60 * 60 * 24)) == 1) return "Yesterday";
                else return (Math.floor(diff / (60 * 60 * 24))) + " days ago";
            }
            //less than 24h ago
            else if (diff > (60 * 60)) {
                //1 hour or more ago
                if (Math.floor(diff / (60 * 60)) == 1) return "1 hour ago";
                else return (Math.floor(diff / (60 * 60))) + " hours ago";
            }
            else {
                if (Math.floor(diff / (60)) == 1) return "1 minute ago";
                else return Math.floor(diff / (60)) + " minutes ago";
            }
        }

        vm.posts = postsSrvc.getPosts();
        console.log("TEST: ", vm.posts, postsSrvc.getPosts());
    }


})();
