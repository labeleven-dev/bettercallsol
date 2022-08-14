const lines = [];
process.stdin.on("data", (chunk) => {
  lines.push(chunk);
});

process.stdin.on("end", () => {
  const report = JSON.parse(lines.join());
  report.forEach(({ name, installedVersion, licenseType }) => {
    console.log(`${name} (${installedVersion}), licenced ${licenseType}<br />`);
  });
  console.log("Phone icons created by Freepik - Flaticon");
});
