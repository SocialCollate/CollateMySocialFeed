const FACEBOOK_SERVICE = {
    getPosts : function (account) {
    
    },
    getDetail : function (account){
        FB.api('/me', { access_token: account.access_token, fields: 'name, email' }, function (response) {
            if (response) {
                console.log(response);
                return {
                    name:response.name,
                    email:response.email
                }
            }
            else return {
                error:"error"
            }
        });
    },
    login : function($cordovaOauth, callback){
        $cordovaOauth.facebook(FB_APP_ID, ["user_posts"]).then(function (result) {
            callback({
                platform_name: "facebook",
                access_token: result.access_token,
                expiry: result.expires_in,
                time_created: Date.now()
            });
            return;
        }, function(error){
            console.log("facebook login attempt failed: ", error);
            callback({error});
            return;
        });

    }

}

