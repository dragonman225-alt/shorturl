"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUrl = exports.insertUrl = void 0;
const typeorm_1 = require("typeorm");
const url_1 = require("./entities/url");
const utils_1 = require("./utils");
async function insertUrl(validUrl) {
    const repository = (0, typeorm_1.getRepository)(url_1.Url);
    const existingUrl = await repository.findOne({ originalUrl: validUrl });
    if (existingUrl) {
        return existingUrl.shortHash;
    }
    const urlCount = await repository.count();
    const shortHash = (0, utils_1.toBase58)(urlCount);
    const newUrl = new url_1.Url(shortHash, validUrl);
    await repository.save(newUrl);
    return shortHash;
}
exports.insertUrl = insertUrl;
async function findUrl(shortHash) {
    const repository = (0, typeorm_1.getRepository)(url_1.Url);
    const url = await repository.findOne({ shortHash });
    if (url)
        return url.originalUrl;
    else
        return undefined;
}
exports.findUrl = findUrl;
//# sourceMappingURL=service.js.map