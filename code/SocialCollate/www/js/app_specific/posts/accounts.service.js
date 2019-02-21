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

        var service = {

        };

        service.ACCOUNTS = [];
        service.getAccounts = function () {
            service.ACCOUNTS = [];
            //read acounts from local storage.
            let accountsStr = window.localStorage.getItem("accounts");

            let extractedArray = accountsStr.split(";");
            for (let i = 0; i < extractedArray.length; i++) {
                let extractedItem = extractedArray[i].split(",");
                service.ACCOUNTS[i] = {
                    account_num: extractedItem[0],
                    access_token: extractedItem[1],
                    expiry: extractedItem[2],
                    time_created: extractedItem[3]
                }
            }
            //now ACCOUNTS is updated.
        }

        service.storeAccount = function (account) {
            //store new/update old account in local storage.
            var arrayLength = service.ACCOUNTS.length;

            for (var i = 0; i < arrayLength; i++) {

                if (service.ACCOUNTS[i].account_num == account.account_num) {

                    service.ACCOUNTS[i].platform_name
                    service.ACCOUNTS[i].access_token = account.access_token;
                    service.ACCOUNTS[i].expiry = account.expiry;
                    service.ACCOUNTS[i].time_created = account.time_created;

                } else {
                    service.ACCOUNTS.push(account);
                }
                storeLocalAccounts()
            }
        }


        function storeLocalAccounts() {
            var arrayLength = service.ACCOUNTS.length;
            var string = "";

            for (var i = 0; i < arrayLength; i++) {

                string += service.ACCOUNTS[i].account_num + ",";
                string += service.ACCOUNTS[i].platform_name + ",";
                string += service.ACCOUNTS[i].access_token + ",";
                string += service.ACCOUNTS[i].expiry + ",";
                string += service.ACCOUNTS[i].time_created + ";";

            }

            window.localStorage.setItem("accounts", string);
        }

        



        service.deleteAccount = function (account) {

            var index = checkIndex(account);

            //index of account comes from the checkIndex function
            //array slice saves a shallow copy of array list need to look more into this
            service.ACCOUNTS = service.ACCOUNTS.slice(index, 1);

            // use existing fuction to store new array list
            storeLocalAccounts();


        }

        function getDeets(account) {
            //return new obj with data.
            // data : {name:bob,...}
            account = ACCOUNT[checkIndex(account)];

            switch (account.platform_name.toLowerCase()) {
                case "facebook":
                    FB.api('/me', { fields: 'first_name, last_name, email' }, function (response) {
                        console.log("response");
                    });
                    break;
                case "twitter":

                    break;
            }

        }

        //function to check index of account object
        function checkIndex(account) {
            var index;
            index = service.ACCOUNTS.findIndex(account);

            //returns the index 
            return index;

        }



        
        return service;
    }

})();