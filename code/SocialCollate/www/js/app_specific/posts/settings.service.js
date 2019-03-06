(function () {
    'use strict';

    angular
        .module('postsjs')
        .factory('settingsSrvc', settingsSrvc);

    settingsSrvc.$inject = [
        '$q', // promises service
        '$timeout', // timeout service
        'moment', // does dates really well
    ];

    function settingsSrvc(
        $q,
        $timeout,
        moment
    ) {

        var service = {

        };

        service.enabled_accounts = [];

        service.show_feeds = [];

        service.getShowFeeds = function () {
            service.show_feeds = [];

            let show_feeds = window.localStorage.getItem("show_feeds");
            if (show_feeds == null) { window.localStorage.setItem("show_feeds", ""); show_feeds = ""; }

            if (show_feeds.length != 0) {
                let extractedArray = show_feeds.split(",");
                for (let i = 0; i < extractedArray.length; i++) {
                    let extractedItem = extractedArray[i];
                    if (extractedItem.length > 0) {
                        service.show_feeds.push(extractedItem);
                    }
                }
            }
            //now show_feeds is updated.
            return service.show_feeds;
        }

        service.accountEnabled = function (account) {
            //returns true if the account is enabled (if it is in the show_feeds store)
            service.getShowFeeds();
            for (let i = 0; i < service.show_feeds.length; i++) {
                if (account.account_num + "" === service.show_feeds[i]) return true;
            }
            return false;
        }

        return service;

    }

})();