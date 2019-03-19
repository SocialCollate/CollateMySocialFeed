
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

        let USER_SETTINGS_DEFAULT = {
            max_posts_per_account: 20,
            max_posts_total: 30,
            dummy_global: true,
        }

        service.enabled_accounts = [];

        service.show_feeds = [];

        let user_settings = {};

        let knownSettings = {
            "max_posts_per_account": {
                id: "max_posts_per_account",
                type: 'number',
                min: 5,
                max: 200,
                title: "Max posts per account",
                desc: "Maximum number of posts returned by each account.",
                isValid: function (value) {
                    let num = parseInt(value);
                    if (typeof num === 'number') {
                        if (num >= this.min) {
                            if (num <= this.max) {
                                return true;
                            } else return "value must be less than or equal to " + this.max;
                        } else return "value must be greater than or equal to " + this.min;
                    } else return "value must be a number.";
                }
            },
            "max_posts_total": {
                id: "max_posts_total",
                type: 'number',
                min: 5,
                max: 200,
                title: "Max posts total",
                desc: "Maximum number of posts returned by any search. Must be greater than or equal to \"Max posts per account\".",
                isValid: function (value) {
                    let num = parseInt(value);
                    if (typeof num === 'number') {
                        if (num >= this.min) {
                            if (num <= this.max) {
                                return true;
                            } else return "value must be less than or equal to " + this.max;
                        } else return "value must be greater than " + this.min;
                    } else return "value must be a number.";
                }
            },
            "dummy_global": {
                id: "dummy_global",
                type: 'boolean',
                title: "Use dummy data",
                desc: "Use false 'dummy' test data for posts and accounts. Use for debug purposes only.",
                isValid: function (value) {
                    if (typeof value === 'boolean') return true;
                    else return "value must be boolean";
                }
            },
        }

        service.getKnownSettings = function () {
            return angular.copy(knownSettings);
        }


        service.saveSettings = function (new_settings) {
            user_settings = angular.copy(new_settings);
            let newUserSettingsStr = "";

            let keys = Object.keys(new_settings);
            for (let s = 0; s < keys.length; s++) {
                let key = keys[s];
                let value = new_settings[key];
                newUserSettingsStr += key + ":" + value.toString() + ";";
            }

            window.localStorage.setItem("user_settings", newUserSettingsStr);
        }

        service.updateUserSettings = function () {
            user_settings = {};

            let settingsStr = window.localStorage.getItem("user_settings");
            console.log("settings: ", settingsStr);
            if ((settingsStr === null) || (settingsStr === undefined) || (settingsStr === "")) {
                //get default settings
                service.saveSettings(USER_SETTINGS_DEFAULT);
            }
            else {
                let settings_array = settingsStr.split(";");
                settings_array.splice(settings_array.length - 1, 1);

                for (let s = 0; s < settings_array.length; s++) {
                    let setting = settings_array[s].split(":");

                    let key = setting[0];
                    let value = setting[1];

                    //transform strings
                    if (!isNaN(parseInt(value))) value = parseInt(value);

                    else if (value === "true") value = true;
                    else if (value === "false") value = false;


                    console.log("adding setting '", key, "' with value '", value, "'");
                    user_settings[key] = value;
                }
            }
        }

        service.deleteAllAccounts = function () {
            window.localStorage.setItem("user_settings", "");
            user_settings = {};
        }

        service.getUserSettings = function () {
            if (Object.keys(user_settings).length == 0) {
                service.updateUserSettings();
            }
            return angular.copy(user_settings);
        }

        service.saveShowFeeds = function(new_show_feeds){
            //saves the new show feeds
            let newShowFeedsStr = "";

            for (let f = 0; f < new_show_feeds.length; f++) {
                    newShowFeedsStr += new_show_feeds[f].toString() + ",";
            }

            window.localStorage.setItem("show_feeds", newShowFeedsStr);
            console.log("SET SHOW_FEEDS:",newShowFeedsStr);
        }

        service.getShowFeeds = function () {

            service.show_feeds = [];

            let show_feeds = window.localStorage.getItem("show_feeds");
            if (show_feeds === null) { window.localStorage.setItem("show_feeds", ""); show_feeds = ""; }

            console.log("SHOW_FEEDS", show_feeds);
            if (show_feeds.length != 0) {
                let extractedArray = show_feeds.split(",");
                for (let i = 0; i < extractedArray.length; i++) {
                    let extractedItem = extractedArray[i];
                    if (extractedItem.length > 0) {
                        service.show_feeds.push(extractedItem);
                    }
                }
            }
            console.log("show feeds before splice:",service.show_feeds);
            //now show_feeds is updated.
            return angular.copy(service.show_feeds);
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