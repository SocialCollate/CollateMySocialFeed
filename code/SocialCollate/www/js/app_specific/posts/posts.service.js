(function () {
    'use strict';

    angular
        .module('eventsjs')
        .factory('eventsSrvc', eventsSrvc);

    eventsSrvc.$inject = [
        '$q', // promises service
        '$timeout', // timeout service
        'moment' // does dates really well
    ];

    function eventsSrvc(
        $q,
        $timeout,
        moment
    ) {
        var eventsArray = [];
        var service = {

        };

        var PAUSE_FOR_A_WHILE_MS = 3000;
        var MAX_POSTS = 20;


        var createPost = function (id, from, when, caption, description, image, message) {
            //see
            //https://developers.facebook.com/docs/graph-api/reference/v3.2/post
            //for Post attributes.
            return {
                id,
                from,
                when,
                caption,
                description,
                image,
                message
            }
        }
        var APP_ID_FB = 954844384905992;
        var getPosts = function (numToGet) {
            var result = [];
            var response = [];
            //get Posts from FB
            $cordovaOAuth.facebook(APP_ID_FB, )
            for (var index = 0; (index < numToGet && index < response.length); index++) {
                let post = response[index];
                result.push(createPost(post.id, post.from, post.created_time, post.caption, post.description, post.picture, post.message));
            }
            return result;
        }


        var replaceWithRealCode = function () {
            var deferred = $q.defer();

            $timeout(
                function () {
                    eventsArray = getPosts(MAX_POSTS);
                    deferred.resolve(eventsArray);
                },
                PAUSE_FOR_A_WHILE_MS);


            return deferred.promise;
        }

        var promiseToUpdateEvents = function () {
            // returns a promise
            return replaceWithRealCode();
        }

        service.updateEvents = function () {
            return promiseToUpdateEvents();
        }

        service.getEvents = function () {
            return angular.copy(eventsArray);
        }

        service.getNumEvents = function () {
            return eventsArray.length;
        }

        service.getEventAt = function (index) {
            return angular.copy(eventsArray[index]);
        }


        return service;

    }


})();