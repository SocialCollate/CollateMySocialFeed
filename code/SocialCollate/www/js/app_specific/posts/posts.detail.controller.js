(function () {
    'use strict';

    angular
        .module('postsjs')
        .controller('postsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        ];
    
    function control(
        $state,
        $stateParams,
    ) {
        var vm = angular.extend(this, {
            post : {
                name: "no name",
                timestamp: new Date(),
                title : "no title"
            }
         });

        vm.goBack = function(){
            $state.go("posts_list");
        }
        vm.getLogo = function (platform_name){
            return "img/"+platform_name+".png";
        }

        var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        //use full months ('february' instead of 'feb')
        let use_long_dates = false;

        function dInt(number){
            //adds 0 to the start if necessary
            if (number<10) return "0"+number;
            else return number;
        }

        vm.formatDate = function(date){
            let months;
            if (use_long_dates) months = mL;
            else months = mS;
            return date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear()+", "+dInt(date.getHours())+":"+dInt(date.getMinutes());
        }

        vm.getIcon = function (stat){
            // returns the correct icon for this stat.
            switch (stat){
                case "retweets":
                    return "icon ion-loop";
                case "favorites":
                    return "icon ion-heart";
                case "likes":
                    return "icon ion-thumbsup";
                case "shares":
                    return "icon ion-share";
                case "comments":
                    return "ion-email";
                default:
                    return "icon ion-help-circled";
            }
        }

        var params = $stateParams;

        vm.post = params.post;
        vm.stats = params.post.stats;
        vm.stats_keys = Object.keys(params.post.stats);
        console.log(vm.stats);
    }
})();
