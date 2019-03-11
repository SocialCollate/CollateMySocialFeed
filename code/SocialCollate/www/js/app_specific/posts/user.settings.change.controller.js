
(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('userSettingsChangeCtrl', control);

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
            setting: {}
        });
        vm.goBack = function () {
            $state.go("user_settings",{settings:settings, changes:changes});
        };

        let setting = $stateParams.setting;
        let info = $stateParams.info;
        let changes = $stateParams.changes;

        let settings = $stateParams.settings;

        vm.needs_confirm = false;


        let rangeInput = document.getElementById("range_input");
        let readout = document.getElementById("readout");
        let confirmBtn = document.getElementById("confirm_btn");

        readout.innerHTML = setting;

        function update() {
            readout.innerHTML = rangeInput.value;
            vm.needs_confirm = true;
            confirmBtn.style.opacity = "1";
        }

        rangeInput.addEventListener("input", update);



        vm.getMin = function () {
            return info.min;
        }
        vm.getMax = function () {
            return info.max;
        }
        vm.getValueDefault = function () {
            return setting;
        }
        vm.getStep = function () {
            return 5;
        }
        vm.getSettingTitle = function () {
            return info.title;
        }
        vm.needsConfirm = function () {
            return needs_confirm;
        }
        vm.confirm = function () {
            settings[info.id] = rangeInput.value;
            changes = true;
            $state.go("user_settings", { settings: settings, set: { key: info.id, value: rangeInput.value } });
        }


        let knownSettings = settingsSrvc.getKnownSettings();

        let saved = true;

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
            $state.go("user_settings_change", { setting: vm.settings[setting_key], info: knownSettings[setting_key] })
        }

        vm.needsSaving = function () {
            return !saved;
        }

        vm.saveChanges = function () {
            settingsSrvc.saveSettings(angular.copy(vm.settings));
            saved = true;
        }

        vm.settings = settingsSrvc.getUserSettings();

        vm.setting_keys = Object.keys(vm.settings);

    }


})();
