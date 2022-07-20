const versionOnly = process.env["CI_VERSION_ONLY"];

// analyse the commits and output the version
const versionOnlyPlugins = [
  "@semantic-release/commit-analyzer",
  [
    "@semantic-release/exec",
    {
      // this only works in shell
      prepareCmd: "echo ${nextRelease.version} > .version",
    },
  ],
];

// similar to default but without npm plugin, coz no npm publish
const defaultPlugins = [
  "@semantic-release/commit-analyzer",
  "@semantic-release/release-notes-generator",
  "@semantic-release/github",
];

module.exports = {
  defaultBranch: "main",
  // similar to default but uses "main", instead of "master"
  branches: [
    "+([0-9])?(.{+([0-9]),x}).x",
    "main",
    "next",
    "next-major",
    {
      name: "beta",
      prerelease: true,
    },
    {
      name: "alpha",
      prerelease: true,
    },
  ],
  plugins: versionOnly ? versionOnlyPlugins : defaultPlugins,
};
