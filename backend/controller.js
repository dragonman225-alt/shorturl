"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const service_1 = require("./service");
const utils_1 = require("./utils");
class Controller {
    constructor(options = { blacklistHosts: [] }) {
        this.createUrl = (req, res) => {
            const longUrl = req.body.url;
            if (!(0, utils_1.isValidUrl)(longUrl)) {
                res.json({ error: true, hash: '', message: 'Invalid URL' });
                return;
            }
            if ((0, utils_1.isBlacklistedUrl)(longUrl, this.blacklistHosts)) {
                res.json({
                    error: true,
                    hash: '',
                    message: 'Redirection to the URL is not allowed',
                });
                return;
            }
            (0, service_1.insertUrl)(longUrl)
                .then(shortHash => res.json({ error: false, hash: shortHash, message: '' }))
                .catch(error => {
                console.error(error);
                res.json({ error: true, hash: '', message: 'Failed to insert URL' });
            });
        };
        this.findUrlAndRedirect = (req, res) => {
            const shortHash = req.params.shortHash;
            if (!shortHash)
                res.redirect('/');
            else {
                (0, service_1.findUrl)(shortHash)
                    .then(originalUrl => {
                    /** Redirection uses 301, the same as https://tinyurl.com/ */
                    if (!originalUrl)
                        res.redirect('/');
                    else
                        res.redirect(301, originalUrl);
                })
                    .catch(error => {
                    console.error(error);
                    res.redirect('/');
                });
            }
        };
        this.blacklistHosts = Array.isArray(options.blacklistHosts)
            ? options.blacklistHosts
            : [];
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map