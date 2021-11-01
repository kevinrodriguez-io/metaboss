const fs = require("fs/promises");

/**
 * @typedef {Object} Snapshot
 * @property {string} owner_wallet
 * @property {string} token_address
 * @property {string} mint_account
 */

const groupBy = (arr, key) =>
  arr.reduce(
    (r, v, _, __, k = v[key]) => ((r[k] || (r[k] = [])).push(v), r),
    {}
  );

(async () => {
  const fileContents = await fs.readFile(
    "5ujZ8BBFXpcByNbQdxANxbydxUhz5hVavpapvrEUc2Da_snapshot.json",
    "utf-8"
  );
  
  /**
   * @type {Snapshot[]}
   */
  const json = JSON.parse(fileContents);

  const grouped = groupBy(json, "owner_wallet");
  // Sort grouped by length
  const sorted = Object.entries(grouped).sort(
    (a, b) => b[1].length - a[1].length
  );

  // Go through first 5 groups and output their second element length
  for (let i = 0; i < 10; i++) {
    console.log(`${sorted[i][0]} HOLDS: ${sorted[i][1].length}`);
  }

  // Write sorted to file
  await fs.writeFile(
    "5ujZ8BBFXpcByNbQdxANxbydxUhz5hVavpapvrEUc2Da_snapshot_sorted.json",
    JSON.stringify(sorted, null, 2)
  );


  // Get all unique owner_wallet from json
  const ownerWallets = json.map((snapshot) => snapshot.owner_wallet);
  console.log(`Owner wallets length: ${ownerWallets.length}`);
  const uniqueOwnerWallets = [...new Set(ownerWallets)];
  // Write unique holders to file
  await fs.writeFile(
    "5ujZ8BBFXpcByNbQdxANxbydxUhz5hVavpapvrEUc2Da_unique_holders.json",
    JSON.stringify(uniqueOwnerWallets)
  );
  console.log(`Total: holders ${uniqueOwnerWallets.length}`);
})();
