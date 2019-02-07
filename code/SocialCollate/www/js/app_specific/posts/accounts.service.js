(function () {
    'use strict';

    angular
        .module('eventsjs')
        .factory('accountsSrvc', accountsSrvc);

    accountsSrvc.$inject = [
        '$q', // promises service
        '$timeout', // timeout service
        'moment' // does dates really well
    ];

    function accountsSrvc(
        $q,
        $timeout,
        moment
    ) {
        var ACCOUNTS = [];
        var service = {

        };

        function getAccounts(){
            ACCOUNTS = [];
            //read acounts from local storage.
            let accountsStr = window.localStorage.getItem("accounts");

            let extractedArray = accountsStr.split(";");
            for (let i = 0; i < extractedArray.length; i ++){
                let extractedItem = extractedArray[i].split(",");
                ACCOUNTS[i] = {
                    account_num:extractedItem[0],
                    access_token:extractedItem[1],
                    expiry:extractedItem[2],
                    time_created:extractedItem[3]
                }
            }
            //now ACCOUNTS is updated.
        }
        return service;

    }


})();