require("dotenv").config();
const { beginRoutineScan } = require("./scan");
const { initDb } = require("./mongo");
const {
  chain: { subscribeFinalizedHead },
} = require("@subsquare/scan-common");

async function main() {
  await initDb();

  await subscribeFinalizedHead();
  await beginRoutineScan();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(() => {
    //  todo: cleanup
  });
