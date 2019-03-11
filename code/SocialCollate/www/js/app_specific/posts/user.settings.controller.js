
(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('userSettingsCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'settingsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        settingsSrvc
    ) {
        var vm = angular.extend(this, {
            settings: []
        });
        vm.goBack = function () {
            if (!saved) {
                if (!confirm("You have unsaved changes. Continue?")) return;
            }
            $state.go("posts_list");
        };



        let saved = true;

        let knownSettings = settingsSrvc.getKnownSettings();

        vm.keyTitle = function (setting_key) {
            let setting_info = knownSettings[setting_key];
            if ((setting_info === null) || (setting_info === undefined)) return setting_key;
            else return setting_info.title;
        }
        vm.keyDesc = function (setting_key) {
            let setting_info = knownSettings[setting_key];
            if ((setting_info === null) || (setting_info === undefined)) return "unknown setting";
            else return setting_info.desc;
        }
        vm.valueFormat = function (value) {
            if (value.toString() === "false") return "OFF";
            else if (value.toString() === "true") return "ON";
            else return value;
        }
        vm.editValue = function (setting_key) {
            console.log(vm.settings[setting_key]);
            if (knownSettings[setting_key].type === 'boolean') {
                //toggle boolean
                vm.settings[setting_key] = !vm.settings[setting_key];
                saved = false;
            }
            else {
                //go to change to edit 
                $state.go("user_settings_change", { settings: angular.copy(vm.settings), setting: vm.settings[setting_key], info: knownSettings[setting_key] });
            }
        }




        vm.needsSaving = function () {
            return !saved;
        }

        vm.saveChanges = function () {
            settingsSrvc.saveSettings(angular.copy(vm.settings));
            saved = true;
        }

        vm.deleteAllSettings = function () {
            settingsSrvc.deleteAllAccounts();
        }

        if ($stateParams.changes) saved = false;

        //get settings from params or from service
        if (Object.keys($stateParams.settings).length>0) {
            vm.settings = $stateParams.settings;
        }
        else vm.settings = settingsSrvc.getUserSettings();
        
        vm.setting_keys = Object.keys(vm.settings);

        //check for set request
        let set = $stateParams.set;
        console.log(set);
        if (set.key) {
            if (knownSettings[set.key].isValid(set.value)) {
                vm.settings[set.key] = set.value;
                saved = false;
                console.log("SETTINGS:", vm.settings);
            }
            else alert("invalid input.");
        }

        

    }


})();
