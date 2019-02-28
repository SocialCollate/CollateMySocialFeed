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

        let service_mapping = {
            facebook : {
                getPosts : FB_GET_POSTS,
                getDetail : FB_GET_DETAIL,
            },
            twitter : {
                getPosts : TWITTER_GET_POSTS,
                getDetail : TWITTER_GET_DETAIL,
            }
        };

        var service = {

        };

        service.ACCOUNTS = [];

        service.noAccounts = function () {
            return (ACCOUNTS.length == 0);
        }
        function addAccountDetails(account) {
            console.log("adding details to account plat:"+account.platform_name);
            switch (account.platform_name.toLowerCase()) {
                case "facebook":
                console.log("FUNFUNFUN");
                    service_mapping.FB_GET_DETAIL(function (response){
                        console.log("response");
                        console.log(response);
                        account.name = response.name;
                        account.email = response.email;
                    });
                    FB.api('/me', { access_token: account.access_token, fields: 'name, email' }, function (response) {
                        
                    });
                    break;
                case "twitter":

                    break;
            }
            return account;
        }
        service.getAccounts = function () {
            console.log("getting accounts");
            service.ACCOUNTS = [];
            //read acounts from local storage.
            let accountsStr = window.localStorage.getItem("accounts");
            console.log("LOCAL STORE: " + window.localStorage.getItem("accounts"));
            if (accountsStr == null) { window.localStorage.setItem("accounts", ""); accountsStr = ""; }
            if (accountsStr.length != 0) {
                let extractedArray = accountsStr.split(";");
                console.log("EXTR ARRAY LEN: "+extractedArray.length);
                console.log(extractedArray);
                for (let i = 0; i < (extractedArray.length-1); i++) {
                    let extractedItem = extractedArray[i].split(",");
                    let account = {
                        account_num: extractedItem[0],
                        platform_name: extractedItem[1],
                        access_token: extractedItem[2],
                        expiry: extractedItem[3],
                        time_created: extractedItem[4]
                    }
                    console.log(account);
                    service.ACCOUNTS[i] = addAccountDetails(account);
                }

            }
            //now ACCOUNTS is updated.
            console.log("RETURNED" + service.ACCOUNTS.length);
            return service.ACCOUNTS;
        }

       

        service.storeAccount = function (account) {
            //store new/update old account in local storage.
            var arrayLength = service.ACCOUNTS.length;
            console.log("storing account");
            for (var i = 0; i < arrayLength; i++) {

                if (service.ACCOUNTS[i].account_num === account.account_num) {

                    service.ACCOUNTS[i].platform_name = account.platform_name;
                    service.ACCOUNTS[i].access_token = account.access_token;
                    service.ACCOUNTS[i].expiry = account.expiry;
                    service.ACCOUNTS[i].time_created = account.time_created;

                    storeLocalAccounts();
                    return;
                }
            }
            //account does not exist. add.
            console.log("ADDED ACCOUNT.");
            service.ACCOUNTS.push(account);
            storeLocalAccounts();
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

        service.deleteAllAccounts = function () {
            window.localStorage.setItem("accounts", "");
            console.log("deleted all accounts");
            service.ACCOUNTS = [];
            return service.ACCOUNTS;
        }

        //function to check index of account object
        function checkIndex(account) {
            var index;
            index = service.ACCOUNTS.findIndex(account);

            //returns the index 
            return index;

        }


        //service.getAccounts();
        return service;
    }

})();