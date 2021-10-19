"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const cli_1 = require("@dnpr/cli");
const api_1 = require("./api");
const service_1 = require("./service");
const utils_1 = require("./utils");
async function startServer() {
    /** Start database. */
    await (0, typeorm_1.createConnection)();
    /** Start express. */
    const port = process.env.PORT || 3001;
    const app = (0, express_1.default)();
    app.listen(port);
    app.use(express_1.default.json());
    /** Create URL. */
    app.post(api_1.SHORT_URLS_API_PATH, (req, res) => {
        const longUrl = req.body.url;
        if (!(0, utils_1.isValidUrl)(longUrl)) {
            res.json({ error: true, hash: '', message: 'Invalid URL' });
            return;
        }
        (0, service_1.insertUrl)(longUrl)
            .then(shortHash => res.json({ error: false, hash: shortHash, message: '' }))
            .catch(error => {
            console.error(error);
            res.json({ error: true, hash: '', message: 'Failed to insert URL' });
        });
    });
    /** Find URL and redirect. */
    app.get(`${api_1.REDIRECT_PATH}/:shortHash`, (req, res) => {
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
    });
    /** Configure public directory. */
    const { flags } = (0, cli_1.parseArgv)(process.argv);
    const publicPath = (0, cli_1.parseFlagVal)(flags, '--public', cli_1.FlagTypes.string, '');
    const absolutePublicPath = path_1.default.join(process.cwd(), publicPath);
    if (publicPath)
        app.use(express_1.default.static(absolutePublicPath));
    /** Print server information. */
    console.log(`Server running at port ${port}`);
    if (!publicPath)
        console.log('API server only');
    else
        console.log(`With public directory "${absolutePublicPath}"`);
}
startServer().catch(error => console.error(error));
//# sourceMappingURL=index.js.map