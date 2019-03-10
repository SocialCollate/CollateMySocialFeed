(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('accountsAddCtrl', control);

    control.$inject = [
        '$state',
        '$cordovaOauth',
        'postsSrvc',
        'accountsSrvc'
    ];

    function control(
        $state,
        $cordovaOauth,
        postsSrvc,
        accountsSrvc
    ) {
        var vm = angular.extend(this, {
            ACCOUNTS: []
        });

        vm.goBack = function(){
            if (accountsSrvc.performWait()){
                let deferred = $q.defer();
                let wait_time = 1000;
                accountsSrvc.getAccounts();
                //wait to allow account service to get details
                $timeout(
                    function () {
                        $state.go('accounts_list');
                        deferred.resolve();
                    },
                    wait_time);
    
    
                return deferred.promise;
            } else {
                $state.go('accounts_list');
            }
        }



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
                        let account = {
                            account_num:nextAccountNum,
                            platform_name,
                        };

                        let scheme_array = accountsSrvc.service_mapping[platform_name].scheme.split(",");
                        for(let s=0;s< scheme_array.length; s++){
                            account[scheme_array[s]] = result[scheme_array[s]];
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
