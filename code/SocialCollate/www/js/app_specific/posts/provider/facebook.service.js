const FACEBOOK_SERVICE = {
    scheme: "access_token,expires_in,time_created",
    getPosts: function (account, callback) {

    },
    getDetail: function (account, callback) {
        FB.api('/me', { access_token: account.access_token, fields: 'first_name, name' }, function (response) {
            if (response) {
                console.log(response);
                callback({
                    name: response.first_name,
                    identifier: response.name,
                });
                return;
            }
            else
                callback({ error: "error" });
            return;
        });
    },
    login: function ($cordovaOauth, callback) {
        $cordovaOauth.facebook(FB_APP_ID, ["user_posts"]).then(function (result) {
            callback({
                platform_name: "facebook",
                access_token: result.access_token,
                expires_in: result.expires_in,
                time_created: Date.now()
            });
            return;
        }, function (error) {
            console.log("facebook login attempt failed: ", error);
            callback({ error });
            return;
        });

    }

}

