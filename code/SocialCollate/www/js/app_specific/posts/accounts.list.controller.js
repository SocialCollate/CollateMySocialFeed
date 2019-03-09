(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('accountsListCtrl', control);

    control.$inject = [
        '$state',
        'postsSrvc',
        'accountsSrvc'
        ];
    
    function control(
        $state,
        postsSrvc,
        accountsSrvc
    ) {
        var vm = angular.extend(this, {
            accounts : []
         });
        
        vm.capitalise = function(string){
            return (string[0].toUpperCase()+string.substring(1));
        }
        

        vm.noAccounts = function(){
            return vm.accounts.length == 0;
        }

        vm.addAccount = function(){
            $state.go('accounts_add');
        }

        vm.deleteAccount = function(index){
            let respond = window.confirm("Are you sure you want to delete this account?");
            console.log(respond);
        }


        vm.getLogo = function (platform_name){
            return "img/"+platform_name+".png";
        }

        vm.showDetail = function (account_index){
            $state.go('account_detail', {accounts:vm.accounts,selected:account_index});
        }

        vm.deleteAllAccounts = function(){
            vm.accounts = accountsSrvc.deleteAllAccounts();
        }

        vm.goBack = function(){
            $state.go("posts_list");
        }

        vm.hasDetail = function (account){
            let name = account.name;
            return (!(name === null || name === undefined));
        }

        if ($state.params.accounts.length > 0){
            vm.accounts = angular.copy($state.params.accounts);
            console.log("copied accounts from params.");
        }
        else if (vm.accounts.length==0||vm.accounts===null||vm.accounts===undefined){
            vm.accounts = accountsSrvc.getAccounts();
            console.log("loaded accounts ",vm.accounts);
        }
        //Confirm dialogue 
    }

})();
