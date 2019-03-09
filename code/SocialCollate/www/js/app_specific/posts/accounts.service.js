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

        let is_read = false;

        //add plugins for providers
        service.service_mapping["facebook"] = FACEBOOK_SERVICE;
        service.service_mapping["twitter"] = TWITTER_SERVICE;

        for(let s=0;s<Object.keys(service.service_mapping).length;s++){
            service.service_mapping[Object.keys(service.service_mapping)[s]].dummy = DUMMY_GLOBAL;
        }



        service.noAccounts = function () {
            return (ACCOUNTS.length == 0);
        }
        function addAccountDetails(account) {
            if (service.service_mapping[account.platform_name] && ((account.name)===null||(account.name===undefined))) {
                console.log("adding details to account plat:" + account.platform_name);
                service.service_mapping[account.platform_name].getDetail(account, function (account_detail) {
                    //uses account detail, same for all platforms.
                    account.name = account_detail.name;
                    account.identifier = account_detail.identifier;
                });
            }
            return account;
        }
        service.getAccounts = function () {
            is_read = true;
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
        
        service.performWait = function(){
            return !is_read;
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

            console.log("attempting to delete ", index);

            let returned = service.ACCOUNTS.splice(index, 1);

            console.log("accounts after deletion :",service.ACCOUNTS, "returned: ",returned);

            if (returned[0].account_num === account.account_num){
                // use existing function to store new array list
                storeLocalAccounts();
                return true;
            }
            else {
                return false;
            }

            


        }

        service.deleteAllAccounts = function () {
            window.localStorage.setItem("accounts", "");
            console.log("deleted all accounts");
            service.ACCOUNTS = [];
            return service.ACCOUNTS;
        }

        //function to check index of account object
        function checkIndex(account) {

            for(let a=0;a<service.ACCOUNTS.length;a++){
                if (account.account_num === service.ACCOUNTS[a].account_num) return a;
            }

            return false;

        }


        //service.getAccounts();
        return service;
    }

})();