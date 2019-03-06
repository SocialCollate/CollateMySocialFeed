(function () {
    'use strict';

    angular
        .module('postsjs')
        .factory('accountsSrvc', accountsSrvc);

    accountsSrvc.$inject = [
        '$q', // promises service
        '$timeout', // timeout service
        'moment', // does dates really well
        'settingsSrvc'
    ];

    function accountsSrvc(
        $q,
        $timeout,
        moment,
        settingsSrvc
    ) {

        var service = {

        };

        service.ACCOUNTS = [];

        service.service_mapping = {};

        //add plugins for providers
        service.service_mapping["facebook"] = FACEBOOK_SERVICE;
        service.service_mapping["twitter"] = TWITTER_SERVICE;




        service.noAccounts = function () {
            return (ACCOUNTS.length == 0);
        }
        function addAccountDetails(account) {
            console.log("adding details to account plat:" + account.platform_name);
            if (service.service_mapping[account.platform_name]) {
                service.service_mapping[account.platform_name].getDetail(account, function (account_detail) {
                    //uses account detail, same for all platforms.
                    account.name = account_detail.name;
                    account.identifier = account_detail.identifier;
                });
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
                console.log("EXTR ARRAY LEN: " + extractedArray.length);
                console.log(extractedArray);
                for (let i = 0; i < (extractedArray.length - 1); i++) {
                    let extractedItem = extractedArray[i].split(",");
                    let account = {
                        account_num: extractedItem[0],
                        platform_name: extractedItem[1],
                    }

                    //add params based on platform scheme
                    let scheme = service.service_mapping[account.platform_name].scheme;
                    let scheme_array = scheme.split(",");
                    for (let s = 0; s < scheme_array.length; s++) {
                        //add param.
                        account[scheme_array[s]] = extractedItem[2 + s];
                    }

                    console.log(account);
                    service.ACCOUNTS[i] = addAccountDetails(account);
                }

            }
            //now ACCOUNTS is updated.
            console.log("RETURNED" + service.ACCOUNTS.length);
            return service.ACCOUNTS;
        }

        service.getEnabledAccounts = function () {
            //returns list of enabled accounts
            let accounts = service.getAccounts();
            let result = [];
            for(let a=0;a<accounts.length;a++){
                if (settingsSrvc.accountEnabled(accounts[a])){
                    result.push(accounts[a]);
                }
            }
            return result;
        }
        


        service.storeAccount = function (account) {
            //store new/update old account in local storage.
            var arrayLength = service.ACCOUNTS.length;
            console.log("storing account");
            for (var i = 0; i < arrayLength; i++) {

                if (service.ACCOUNTS[i].account_num === account.account_num) {


                    service.ACCOUNTS[i].platform_name = account.platform_name;
                    service.ACCOUNTS[i].access_token = account.access_token;

                    let scheme_array = service.service_mapping[account.platform_name].scheme.split(",");
                    for (let s = 0; s < scheme_array.length; s++) {
                        service.ACCOUNTS[i][scheme_array[s]] = result[scheme_array[s]];
                    }


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

                //add scheme params.
                let scheme_array = service.service_mapping[service.ACCOUNTS[i].platform_name].scheme.split(",");
                for (let s = 0; s < scheme_array.length; s++) {
                    string += service.ACCOUNTS[i][scheme_array[s]];
                    if (s < scheme_array.length - 1)
                        string += ","
                    else string += ";";
                }
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