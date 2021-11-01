const fs = require("fs/promises");
const path = require("path");

(async () => {
  // Read the downloaded.json array and sort it's contents by name, then output it's length
  const downloaded = await fs.readFile(
    path.join(__dirname, "downloaded.json"),
    "utf8"
  );
  const sorted = JSON.parse(downloaded).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  console.log(sorted.length);
  // Write sorted contents
  await fs.writeFile(
    path.join(__dirname, "downloaded-sorted.json"),
    JSON.stringify(sorted),
    "utf8"
  );
})();
