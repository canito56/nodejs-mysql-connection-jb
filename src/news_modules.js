const crypto = require("crypto");

function cryptpass(secret) {
    const hash = crypto.createHmac("sha512", secret)
    .update("vamos river todavia CARAJO boquita puto!")
    .digest("hex");
    return hash;
}

module.exports = { "cryptpass": cryptpass };