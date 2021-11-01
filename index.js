const axios = require("axios");
const { readdir, readFile, writeFile } = require("fs/promises");
const path = require("path");
const chunk = require("lodash.chunk");

(async () => {
  const files = await readdir("./decoded");
  const results = [];
  const promises = files.map(async (file) => {
    console.log(`ℹ️ Creating promise for: ${file}`);
    const contents = await readFile(
      path.resolve(__dirname, "./decoded", file),
      "utf8"
    );
    const item = JSON.parse(contents);
    const url = item.data.uri;
    const response = await axios.get(url);
    const data = response.data;
    console.log(`✅ Promise processed for: ${file}`);
    return data;
  });
  const chunks = chunk(promises, 10);
  for (const [index, chunk] of chunks.entries()) {
    console.log(`ℹ️ Processing chunk ${index + 1}/${chunk.length}`);
    const data = await Promise.all(chunk);
    console.log(`✅ Processed chunk ${index + 1}/${chunk.length}`);
    results.push(...data);
  }
  // Write results to a file
  console.log("🚀 Saving downloaded.json")
  await writeFile(
    path.resolve(__dirname, "downloaded.json"),
    JSON.stringify(results)
  );
})();
