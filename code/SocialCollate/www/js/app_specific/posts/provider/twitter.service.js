function serialise_params(params){
    let serial = "";
    let first = true;
    for (let p=0; p< params.length;p++){
        if (first) first = false;
        else serial+="&";
        serial += params[p];
    }
    return serial;
}
function addHeaders(Httpreq, headers){
    for (let h=0;h<headers.length;h++){
        let header = headers[h].split(":");
        Httpreq.setRequestHeader(header[0], header[1]);
    }
    return Httpreq;
}
function get(url, headers, params, callback){
    var Httpreq = new XMLHttpRequest();
    let url_req = url+"?"+serialise_params(params);
    console.log(url_req);
    Httpreq.open("GET",url_req,false);
    Httpreq = addHeaders(Httpreq, headers);
    Httpreq.onload = function(){callback(JSON.parse(Httpreq.response))};       
    Httpreq.send();
}
const TWITTER_SERVICE = {
    scheme: "user_id,oauth_token,oauth_token_secret",
    getPosts : function (account, callback) {
    
    },
    getDetail : function (account, callback){
        console.log(account.user_id);
       get("https://api.twitter.com/1.1/users/show.json",['authorization:OAuth oauth_consumer_key="'+account.consumer_key+'",oauth_nonce="'+generate_oauth_nonce()+'",oauth_signature="'+get_oauth_signature()+'",oauth_signature_method="HMAC-SHA1",oauth_timestamp='+Date.now()],["user_id="+account.user_id], function(result){
            console.log(result);
            callback(result);
       });
    },
    login : function ($cordovaOauth, callback) {
        $cordovaOauth.twitter(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET).then(function(result){
            console.log(result, "twitter response");
            callback({
                platform_name: "twitter",
                user_id: result.user_id,
                oauth_token: result.oauth_token,
                oauth_token_secret: result.oauth_token_secret,
            });
            return;
        }, function(error){
            console.log("twitter login attempt failed: ", error);
            callback({error});
            return;
        });
    }
}