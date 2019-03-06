function serialise_params(params) {
    let serial = "";
    let first = true;
    let keys = Object.keys(params);
    console.log("SERIALISING PARAMS: ", params);
    for (let p = 0; p < keys.length; p++) {
        if (first) first = false;
        else serial += "&";
        serial += keys[p];
        serial += "=";
        serial += params[keys[p]];
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
    Httpreq.open("GET", url_req, true);
    Httpreq = addHeaders(Httpreq, headers);
    Httpreq.onload = function () { callback(JSON.parse(Httpreq.response)) };
    Httpreq.send(null);
}
function generate_oauth_nonce(account) {
    let base = (Date.now() * account.account_num).toString();
    let sha = new jsSHA(base, "TEXT");
    let nonce = sha.getHash("SHA-1", "B64");
    console.log("nonce: " + nonce);
    return nonce;
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
    console.log("encoding ", string);
    let src = string.toString();
    let dst = "";
    //iterate through bytes.
    for (let c = 0; c < src.length; c++) {
        // 1: get next byte.
        let char = src[c].charCodeAt(0);
        // 2: check if in table
        if ((char >= 48 && char <= 57) || (char >= 65 && char <= 90) || (char >= 97 && char <= 122) || (char == 45) || (char == 46) || (char == 95) || (char == 126)) {
            //2a: copy to dst
            dst += String.fromCharCode(char);
        }
        else {
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
function deepClone(obj) {
    //deep clones obj
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    let newObj = {};
    for (let i = 0; i < keys.length; i++) {
        newObj[keys[i]] = values[i];
    }
    return newObj;
}
function get_oauth_signature(method, account, url, req_params, nonce, timestamp) {
    //see creating a oauth signature.
    //https://developer.twitter.com/en/docs/basics/authentication/guides/creating-a-signature.html
    //add method and base url
    method = method.toUpperCase();
    let base_url = url;

    let params = deepClone(req_params);

    //add oauth to params
    params.oauth_consumer_key = TWITTER_CONSUMER_KEY;
    //params.oauth_consumer_key = "xvz1evFS4wEEPTGEFPHBog";
    params.oauth_nonce = nonce;
    params.oauth_signature_method = "HMAC-SHA1";
    params.oauth_timestamp = timestamp;
    params.oauth_token = account.oauth_token;
    params.oauth_version = "1.0";

    params = percentEncodeKeyValue(params);

    let keys = Object.keys(params).sort();

    console.log("SORTED KEYS: ", keys);

    let parameter_string = "";

    //construct parameter string.
    for (let i = 0; i < keys.length; i++) {
        parameter_string += keys[i] + "=" + params[keys[i]];
        if (i < (keys.length - 1)) parameter_string += "&";
    }

    console.log("parameter_string", parameter_string);

    // construct signature base.
    let signature_base = method.toUpperCase() + "&" + percentEncode(base_url) + "&" + percentEncode(parameter_string);

    console.log("sig base", signature_base);
    //get secrets
    let consumer_secret = TWITTER_CONSUMER_SECRET;
    //let consumer_secret = "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw";

    let token_secret = account.oauth_token_secret;

    console.log("token secret", token_secret);

    //create signing key
    let signing_key = percentEncode(consumer_secret) + "&" + percentEncode(token_secret);

    console.log("SIG_BASE: ", signature_base);
    console.log("SIGN_KEY: ", signing_key);


    //hash base and key to produce signature.
    let sha = new jsSHA(signature_base, "TEXT");

    let oauth_signature = sha.getHMAC(signing_key, "TEXT", "SHA-1", "B64");
    console.log("signature: ", oauth_signature);
    return oauth_signature;
}
function constructAuthHead(params) {
    //https://developer.twitter.com/en/docs/basics/authentication/guides/authorizing-a-request
    let dst = "OAuth ";
    for (let i = 0; i < Object.keys(params).length; i++) {
        dst += percentEncode(Object.keys(params)[i]);
        dst += "=";
        dst += "\"";
        dst += percentEncode(params[Object.keys(params)[i]]);
        dst += "\"";
        if (i < Object.keys(params).length - 1) dst += ", ";
    }
    return dst;
}
function generateAuthHeader(method, account, url, params) {
    let timestamp = Math.floor(new Date().getTime() / 1000.0).toString();
    //let timestamp = "1318622958";
    let nonce = generate_oauth_nonce(account);
    //let nonce = "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg";

    console.log("PARAMS: ", params);

    //add oauth to params
    let oauth = {
        oauth_consumer_key: TWITTER_CONSUMER_KEY,
        oauth_nonce: nonce,
        oauth_signature: get_oauth_signature(method, account, url, params, nonce, timestamp),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: account.oauth_token,
        oauth_version: "1.0",
    }


    let authHeader = constructAuthHead(oauth);

    return authHeader;
}
var createPost = function (id, from, when, caption, description, image, message) {
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


const TWITTER_SERVICE = {
    scheme: "user_id,oauth_token,oauth_token_secret",
    getPosts: function (account, num_posts, callback) {
        console.log("getPosts called for ", account);

        let url = "https://api.twitter.com/1.1/statuses/home_timeline.json";
        let params = {  };

        let authorization = generateAuthHeader("GET", account, url, params);


        get(url, ["Authorization: " + authorization], params, function (result) {
            if (result.errors) console.log("FAIL: ", result.errors[0].code, result.errors[0].message);
            else console.log("SUCCESS", result);

            let account_detail = {
                name:result.name,
                identifier:"@"+result.screen_name,
                
            };
            callback(account_detail);
        });
    },
    getDetail: function (account, callback) {

        console.log("getDetail called for ", account);
        let url = "https://api.twitter.com/1.1/users/show.json";
        let params = { "user_id": account.user_id.toString() };

        let authorization = generateAuthHeader("GET", account, url, params);


        get(url, ["Authorization: " + authorization], params, function (result) {
            if (result.errors) console.log("FAIL: ", result.errors[0].code, result.errors[0].message);
            else console.log("SUCCESS", result);

            let account_detail = {
                name:result.name,
                identifier:"@"+result.screen_name,
                
            };
            callback(account_detail);
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