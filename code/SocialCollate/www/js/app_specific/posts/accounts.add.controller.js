(function () {
    'use strict';

    angular
        .module('eventsjs')
        .controller('accountsAddCtrl', control);

    control.$inject = [
        '$state',
        '$cordovaOauth',
        'eventsSrvc',
        'accountsSrvc'
    ];

    function control(
        $state,
        $cordovaOauth,
        eventsSrvc,
        accountsSrvc
    ) {
        var vm = angular.extend(this, {
            ACCOUNTS: []
        });



        vm.oauth_login = function (platform_name) {
            if (accountsSrvc.service_mapping[platform_name]) {
                accountsSrvc.service_mapping[platform_name].login($cordovaOauth, function(result){
                    if (result.error) {
                        console.log("error logging in to platform "+platform_name, result.error);
                    }
                    else {
    
    
                        let ACCOUNTS = accountsSrvc.getAccounts();
    
                        console.log(ACCOUNTS);
    
                        let nextAccountNum;
                        if (ACCOUNTS.length == 0) {
                            nextAccountNum = 1;
                        }
                        else {
                            nextAccountNum = ACCOUNTS[ACCOUNTS.length - 1].account_num + 1;
                        }
                        //results
                        console.log(result);
                        let account;
                        if (result.expiry && result.time_created){
                            account = {
                                account_num: nextAccountNum,
                                platform_name,
                                access_token: result.access_token,
                                expiry: result.expiry,
                                time_created: result.time_created
                            }
                        }
                        else {
                            account = {
                                account_num: nextAccountNum,
                                platform_name,
                                access_token: result.access_token,
                            }
                        }
                        
                        accountsSrvc.storeAccount(account);
    
    
                        console.log("added account. no accounts: " + ACCOUNTS.length);
                        $state.go("accounts_list");
    
                        //search by account_num
    
                    }
                });
                
            }
        }
    }
}) ();
