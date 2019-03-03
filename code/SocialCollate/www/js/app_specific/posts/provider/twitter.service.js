// byte packing/unpacking by Mike Samuel (https://codereview.stackexchange.com/questions/3569/pack-and-unpack-bytes-to-strings)
function serialise_params(params) {
    let serial = "";
    let first = true;
    for (let p = 0; p < params.length; p++) {
        if (first) first = false;
        else serial += "&";
        serial += params[p];
    }
    return serial;
}
function addHeaders(Httpreq, headers) {
    for (let h = 0; h < headers.length; h++) {
        let header = headers[h].split(":");
        Httpreq.setRequestHeader(header[0], header[1]);
    }
    return Httpreq;
}
function get(url, headers, params, callback) {
    var Httpreq = new XMLHttpRequest();
    let url_req = url + "?" + serialise_params(params);
    console.log(url_req);
    Httpreq.open("GET", url_req, false);
    Httpreq = addHeaders(Httpreq, headers);
    Httpreq.onload = function () { callback(JSON.parse(Httpreq.response)) };
    Httpreq.send();
}
function generate_oauth_nonce(account) {
    return Date.now() * account.account_num;
}
function toHex(nibble) {
    let hexes = ["A", "B", "C", "D", "E", "F"];
    if (nibble < 10) {
        return "" + nibble + "";
    }
    else if (nibble < 16) {
        return hexes[nibble - 10];
    }
    else return "error";
}


//https://developer.twitter.com/en/docs/basics/authentication/guides/percent-encoding-parameters.html
function percentEncode(string) {
    //convert string to byte array
    let src = string;
    let dst = "";
    //iterate through bytes.
    for (let c = 0; c < src.length; c++) {
        // 1: get next byte.
        let char = src.charCodeAt(c);
        // 2: check if in table
        if ((char >= 48 && char <= 57) || (char >= 65 && char <= 90) || (char >= 97 && char <= 122) || (char == 45) || (char == 46) || (char == 126)) {
            //2a: copy to dst
            dst += String.fromCharCode(char);
        }
        else {
            console.log(char);
            //2b: continue - encode
            //3: write %
            dst += "%";
            //4: write percent code for byte.
            if (char < 256) {
                dst += toHex((char - (char % 16)) / 16);
                dst += toHex(char % 16);
            }
            else {
                //special characters e.g ☃ get encodeURI
                dst += encodeURI(String.fromCharCode(char));
            }

        }
    }
    //repack bin array to string
    return dst;
}
function percentEncodeKeyValue(params) {
    let result = {};
    for (let i = 0; i < Object.keys(params).length; i++) {
        result[percentEncode(Object.keys(params)[i])] = percentEncode(Object.values(params)[i]);
    }
    return result;
}
function get_oauth_signature(account, nonce, url, params, timestamp) {
    //see creating a oauth signature.
    //https://developer.twitter.com/en/docs/basics/authentication/guides/creating-a-signature.html
    //add method and base url
    let method = "GET";
    let base_url = url;
    //add oauth to params
    params.oauth_consumer_key = TWITTER_CONSUMER_KEY;
    params.oauth_nonce = nonce;
    params.oauth_signature_method = "HMAC-SHA1";
    params.oauth_timestamp = timestamp;
    params.oauth_token = account.oauth_token;
    params.oauth_version = "1.0";

    params = percentEncodeKeyValue(params);

    let keys = sort(Object.keys(params));

    let parameters = "";

    //construct parameter string.
    for (let i = 0; i < keys.length; i++) {
        parameters += keys[i] + "=" + params[keys[i]];
        if (i < (keys.length-1)) parameters += "&";
    }

    // construct signature base.
    let signature_base = method.toUpperCase() + "&" + percentEncode(url) + "&" + percentEncode(parameters);

    //get secrets
    let consumer_secret = TWITTER_CONSUMER_SECRET;
    let token_secret = account.oauth_token_secret;

    //create signing key
    let signing_key = percentEncode(consumer_secret) + "&"+ percentEncode(token_secret);

    //hash base and key to produce signature.
    let oauth_signature = hash_hmac(signature_base, signing_key);

    return oauth_signature;
}
function generateAuthHeader(account, url, params) {
    let nonce = generate_oauth_nonce(account);
    let timestamp = Date.now();
    return 'Authorization: OAuth ' +
        'oauth_consumer_key="' + TWITTER_CONSUMER_KEY + '",' +
        'oauth_nonce="' + nonce + '",' +
        'oauth_signature="' + get_oauth_signature(account, nonce, url, params, timestamp) + '",' +
        'oauth_signature_method="HMAC-SHA1",' +
        'oauth_timestamp="' + timestamp + '",' +
        'oauth_token="' + account.oauth_token + '",' +
        'oauth_version="1.0"';
}
const TWITTER_SERVICE = {
    scheme: "user_id,oauth_token,oauth_token_secret",
    getPosts: function (account, callback) {

    },
    getDetail: function (account, callback) {
        let url = "https://api.twitter.com/1.1/users/show.json";
        let params = ["user_id=" + account.user_id];
        console.log("user_id: ", account.user_id);
        get(url, [generateAuthHeader(account, url, params)], params, function (result) {
            console.log(result);
            callback(result);
        });
    },
    login: function ($cordovaOauth, callback) {
        $cordovaOauth.twitter(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET).then(function (result) {
            console.log(result, "twitter response");
            callback({
                platform_name: "twitter",
                user_id: result.user_id,
                oauth_token: result.oauth_token,
                oauth_token_secret: result.oauth_token_secret,
            });
            return;
        }, function (error) {
            console.log("twitter login attempt failed: ", error);
            callback({ error });
            return;
        });
    }
}