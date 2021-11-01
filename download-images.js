const fsp = require("fs/promises");
const fs = require("fs");
const Axios = require("axios");
const path = require("path");
const rimraf = require("rimraf");
const axios = Axios.default;

(async () => {
  const fileContents = JSON.parse(
    await fsp.readFile("./downloaded-sorted.json", "utf8")
  );
  for (const { name, image } of fileContents) {
    try {
      console.log(`ℹ️ Creating promise for: ${name}`);
      const response = await axios({
        method: "get",
        url: image,
        responseType: "stream",
      });
      const data = response.data;
      console.log(`ℹ️ Got response for: ${name}`);
      await new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(
          path.resolve(__dirname, "images", `${name}.png`)
        );
        data.pipe(stream);
        stream.on("error", () => {
          reject("ERR");
        });
        stream.on("finish", async () => {
          console.log(`✅ Saved: ${name}`);
          // Save the current name into completed-image-downloads.json
          const completedArr = JSON.parse(
            await fsp.readFile(
              path.resolve(__dirname, "completed-image-downloads.json")
            )
          );
          completedArr.push(name);
          await fsp.writeFile(
            path.resolve(__dirname, "completed-image-downloads.json"),
            JSON.stringify(completedArr)
          );
          resolve();
        });
      });
    } catch {
      const itemToRemove = path.resolve(__dirname, "images", `${name}.png`);
      rimraf(itemToRemove, (err) => {
        console.log(`❌ Removed: ${name}`);
        console.error(err);
      });
    }
  }
})();
