const TWITTER_SERVICE = {
    getPosts : function (account) {
    
    },
    getDetail : function (account){
       
    },
    login : function ($cordovaOauth, callback) {
        $cordovaOauth.twitter(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET).then(function(result){
            console.log(result, "twitter response");
            callback({
                platform_name: "twitter",
                access_token: result.access_token,
                expiry: result.expires_in,
                time_created: Date.now()
            });
        }, function(error){
            console.log("twitter login attempt failed: ", error);
            callback({error});
            return;
        });
    }
}