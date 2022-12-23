// ideally we should just use ajv-cli but it hasn't been released a version
// in more than a year and --code-esm has been implemented but not released.

const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const standaloneCode = require("ajv/dist/standalone").default;

const schema = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../src/generated/validate/external-schema.json")
  )
);

// For ESM, the export name needs to be a valid export name, it can not be `export const #/definitions/Foo = ...;` so we
// need to provide a mapping between a valid name and the $id field. Below will generate
// `export const Foo = ...;export const Bar = ...;`
// This mapping would not have been needed if the `$ids` was just `Bar` and `Foo` instead of `#/definitions/Foo`
// and `#/definitions/Bar` respectfully
const ajv = new Ajv({
  code: { source: true, esm: true },
});
const validate = ajv.compile(schema);
let moduleCode = standaloneCode(ajv, validate);

// Now you can write the module code to file
fs.writeFileSync(
  path.join(__dirname, "../src/generated/validate/index.mjs"),
  moduleCode
);
