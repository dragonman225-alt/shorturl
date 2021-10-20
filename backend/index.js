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
const controller_1 = require("./controller");
async function startServer() {
    /** Start database. */
    await (0, typeorm_1.createConnection)();
    /** Start express. */
    const port = process.env.PORT || 3001;
    const app = (0, express_1.default)();
    app.listen(port);
    app.use(express_1.default.json());
    /** Configure public directory. */
    const { flags } = (0, cli_1.parseArgv)(process.argv);
    /** Path to static assets. */
    const publicPath = (0, cli_1.parseFlagVal)(flags, '--public', cli_1.FlagTypes.string, '');
    const absolutePublicPath = path_1.default.join(process.cwd(), publicPath);
    if (publicPath)
        app.use(express_1.default.static(absolutePublicPath));
    /**
     * Reject shortening for hosts, can be used to prevent recursive
     * redirection to the service itself.
     * Note: host = hostname + port
     */
    const blacklistHostsSpaceSeparated = (0, cli_1.parseFlagVal)(flags, '--blacklist-hosts', cli_1.FlagTypes.string, '');
    const blacklistHosts = blacklistHostsSpaceSeparated
        .trim()
        .split(' ')
        .filter(str => !!str);
    const controller = new controller_1.Controller({ blacklistHosts });
    /** Create URL. */
    app.post(api_1.SHORT_URLS_API_PATH, controller.createUrl);
    /** Find URL and redirect. */
    app.get(`${api_1.REDIRECT_PATH}/:shortHash`, controller.findUrlAndRedirect);
    /** Print server information. */
    console.log(`Server running at port ${port}`);
    if (!publicPath)
        console.log('API server only');
    else
        console.log(`With public directory "${absolutePublicPath}"`);
    if (blacklistHosts)
        console.log('Blacklisted host:', blacklistHosts);
}
startServer().catch(error => console.error(error));
//# sourceMappingURL=index.js.map