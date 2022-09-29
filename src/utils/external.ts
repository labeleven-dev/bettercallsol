export const SCHEMA_VERSION_ARRAY = [1, 0, 0];
export const SCHEMA_VERSION = SCHEMA_VERSION_ARRAY.join(".");

/** Versions are compatible if in the same major and minor revision, i.e. only patch version can differ **/
export const versionCompatible = (version: string) => {
  const [major, minor, _] = version.split(",").map((x) => parseInt(x));
  return major === SCHEMA_VERSION_ARRAY[0] && minor === SCHEMA_VERSION_ARRAY[1];
};
