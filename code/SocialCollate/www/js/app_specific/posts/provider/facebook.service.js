

const FACEBOOK_SERVICE = {
    dummy: false,
    scheme: "access_token,expires_in,time_created",
    getDummy:function(){
        return [{
            platform_name:"facebook",
            id:2397823498,
            from:"Bob Bobson",
            when:new Date(),
            text:"SAMPLE TEXT",
            image: {src:null},
            stats:{
                shares:140
            }
        }];
    },
    getPosts: function (account, num_posts, callback) {
        console.log("getPosts called for FACEBOOK");
        if (this.dummy){
            callback(this.getDummy());
            return;
        }

        let posts = [];
        FB.api('/me/feed',
        {access_token:account.access_token},
        function (response){
            console.log("FB getPosts response: ",response);

            for (let p=0;p<response.data.length;p++){
                let post = response.data[p];

                posts.push({
                    platform_name: "facebook",
                    id: post.id,
                    from: post.from ? post.from.name : account.name,
                    when: new Date(post.created_time),
                    text: post.message,
                    image: {src:post.picture},
                    stats: {
                        shares:post.shares,
                    }
                });

            }

            //splice does NOT return shallow copy, it returns removed elements...
            posts.splice(num_posts);
            console.log("posts before return: ",posts)
            callback(posts);
        });
    },
    getDetail: function (account, callback) {
        if (this.dummy){
            callback({
                name:"Anon",
                identifier: "Anonymous Dude"
            });
            return;
        }

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

