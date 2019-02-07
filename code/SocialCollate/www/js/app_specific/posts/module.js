
function storeAccount(account) {

    var arrayLength = ACCOUNTS.length;

    for (var i = 0; i < arrayLength; i++) {

        if (ACCOUNTS[i].account_num == account.account_num) {

            ACCOUNTS[i].access_token = account.access_token;
            ACCOUNTS[i].expiry = account.expiry;
            ACCOUNTS[i].time_created = account.time_created;

        } else {
            ACCOUNTS.push(account);
        }
        storeLocalAccounts()
    }
}


function storeLocalAccounts() {

    var arrayLength = ACCOUNTS.length;
    var string = "";

    for (var i = 0; i < arrayLength; i++) {

        string += ACCOUNTS[i].account_num + ",";
        string += ACCOUNTS[i].access_token + ",";
        string += ACCOUNTS[i].expiry + ",";
        string += ACCOUNTS[i].time_created + ";";

    }

    window.localStorage.setItem("accounts",string);
}
