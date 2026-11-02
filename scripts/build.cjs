// Rebuild both distributable editions and the service worker before publishing.
const h5 = require("./build-h5.cjs").build();
const portable = require("./build-local.cjs").build();
console.log({ h5, portable });
