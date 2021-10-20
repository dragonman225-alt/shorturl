const sourcePackageJson = require("../backend/package.json");
const packageJson = {
  name: "shorturl-deploy",
  version: "0.1.0",
  private: true,
  author: "dragonman225",
  license: "MIT",
  main: "backend/index.js",
  scripts: {
    start: "node . --public=frontend --blacklist-hosts=lurt.herokuapp.com",
  },
  dependencies: sourcePackageJson.dependencies,
};

console.log(JSON.stringify(packageJson));
