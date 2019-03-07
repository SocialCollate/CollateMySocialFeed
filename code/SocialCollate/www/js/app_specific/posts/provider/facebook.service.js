var createPost = function (id, from, when, caption, description, image, message) {
    //see
    //https://developers.facebook.com/docs/graph-api/reference/v3.2/post
    //for Post attributes for FB.
    return {
        id,
        from,
        when,
        caption,
        description,
        image,
        message
    }
}

const FACEBOOK_SERVICE = {
    
    scheme: "access_token,expires_in,time_created",
    getPosts: function (account, num_posts, callback) {
        let posts = [];
        FB.api('/me/feed',
        {access_token:account.access_token},
        function (response){
            console.log("FB getPosts response: ",response);
            for (let p=0;p<response.length;p++){
                let post = response[p];

                posts.push({
                    platform_name: "facebook",
                    id: post.id,
                    from: post.from.name,
                    when: post.created_time,
                    text: post.message,
                    image: {src:post.picture},
                    stats: {
                        shares:post.shares,
                    }
                });

            }

            posts = posts.splice(num_posts);
            callback(posts);
        });
    },
    getDetail: function (account, callback) {
        FB.api('/me', { access_token: account.access_token, fields: 'first_name, name' }, function (response) {
            if (response) {
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

