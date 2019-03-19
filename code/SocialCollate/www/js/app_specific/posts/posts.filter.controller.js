
(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('postsFilterCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'settingsSrvc',
        'accountsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        settingsSrvc,
        accountsSrvc
    ) {

        var vm = angular.extend(this, {
            accounts: []
        });

        let needs_saving = false;
        let confirmBtn = document.getElementById("confirm_btn");

        function getSearch() {
            let searchText = $("input#searchtext").value();
            return {
                text: searchText
            }
        }

        vm.goBack = function () {
            $state.go('posts_list');
        }
        vm.search = function () {
            $state.go('posts_list', { search: getSearch() });
        }

        vm.accounts = accountsSrvc.getAccounts();
        let enabled_accounts = settingsSrvc.getShowFeeds();

        vm.checked = function (account_num) {
            console.log("checking if account checked:", account_num);
            if (vm.enabled(account_num)) {
                return "checked";
                return "";
            }
        }
        vm.enabled = function (account_num) {
            for (let a = 0; a < enabled_accounts.length; a++) {
                if (account_num == enabled_accounts[a]) return true;
            }
            return false;
        }
        vm.getLogo = function (platform_name) {
            return "img/" + platform_name + ".png";
        }
        vm.hasDetail = function (account) {
            let name = account.name;
            return (!(name === null || name === undefined));
        }
        function update() {
            if (!needs_saving) {
                needs_saving = true;
                confirmBtn.style.opacity = "1";
            }
            updateCheckBoxes();
        }
        function disable(account_num) {
            for (let a = 0; a < enabled_accounts.length; a++) {
                if (account_num === enabled_accounts[a]) enabled_accounts.splice(a, 1);
            }
        }
        function enable(account_num) {
            for (let a = 0; a < enabled_accounts.length; a++) {
                if (account_num === enabled_accounts[a]) return;
            }
            enabled_accounts.push(account_num);
        }
        vm.toggle = function (account_num) {

            if (vm.enabled(account_num)) disable(account_num);
            else enable(account_num);

            update();

        }

        function saveChanges() {
            console.log("saving accounts: ", enabled_accounts);
            accountsSrvc.setEnabledAccounts(enabled_accounts);
        }



        vm.confirm = function () {
            saveChanges();
            confirmBtn.style.opacity = "0";
            needs_saving = false;
        }

        console.log("enabled: ", enabled_accounts);
        function updateCheckBoxes() {
            let items = document.getElementsByTagName("ion-checkbox");
            for (let i = 0; i < items.length; i++) {
                let account = vm.accounts[i];
                let checkbox = items[i];
                if (vm.enabled(account.account_num)){
                    let attr = checkbox.createAttribute("checked");
                    attr.value = "checked";
                    checkbox.setAttributeNode(attr);
                }
                else {
                    checkbox.removeAttribute("checked");
                }

            }
        }

        updateCheckBoxes();
    }

})();
