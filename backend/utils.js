"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlacklistedUrl = exports.toBase58 = exports.isValidUrl = void 0;
const url_1 = require("url");
function isValidUrl(url) {
    try {
        new url_1.URL(url);
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.isValidUrl = isValidUrl;
function toBase58(count) {
    /**
     * Use Base58, which doesn't include confusing chars 0OIl.
     * @see https://en.wikipedia.org/wiki/Base62
     */
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const divisor = chars.length;
    let dividend = count;
    const results = [];
    do {
        const mod = dividend % divisor;
        results.push(chars[mod]);
        dividend = dividend / divisor;
    } while (dividend > 0);
    return results.join('');
}
exports.toBase58 = toBase58;
function isBlacklistedUrl(url, blacklistHosts) {
    try {
        const urlObj = new url_1.URL(url);
        for (let i = 0; i < blacklistHosts.length; i++) {
            const blacklistHost = blacklistHosts[i];
            if (urlObj.host === blacklistHost)
                return true;
        }
        return false;
    }
    catch (error) {
        return true;
    }
}
exports.isBlacklistedUrl = isBlacklistedUrl;
//# sourceMappingURL=utils.js.map