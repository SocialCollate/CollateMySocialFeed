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

        function storeAccount(account) {
            //store new/update old account in local storage.
            var arrayLength = ACCOUNTS.length;
        
            for (var i = 0; i < arrayLength; i++) {
        
                if (ACCOUNTS[i].account_num == account.account_num) {
        
                    ACCOUNTS[i].access_token = account.access_token;
                    ACCOUNTS[i].expiry = account.expiry;
                    ACCOUNTS[i].time_created = account.time_created;
        
                } else {
                    ACCOUNTS.push(account);
                }
                storeLocalAccounts()
            }
        }
        
        
        function storeLocalAccounts() {
            var arrayLength = ACCOUNTS.length;
            var string = "";
        
            for (var i = 0; i < arrayLength; i++) {
        
                string += ACCOUNTS[i].account_num + ",";
                string += ACCOUNTS[i].access_token + ",";
                string += ACCOUNTS[i].expiry + ",";
                string += ACCOUNTS[i].time_created + ";";
        
            }
        
            window.localStorage.setItem("accounts",string);
        }

        return service;

    }


})();