require("dotenv").config();
const { closeKnownClient } = require("./mongo/knownHeight");
const { closeDataDbClient } = require("./mongo/data");

const { getBountyHeights } = require("./heights/bounty");
const { getMotionHeights } = require("./heights/motion");
const { getTipHeights } = require("./heights/tip");
const { getExternalHeights } = require("./heights/democracyExternal");
const {
  getDemocracyPublicProposalHeights,
} = require("./heights/democracyPublicProposal");
const { getReferendumHeights } = require("./heights/democracyReferendum");
const { getPreImageHeights } = require("./heights/preImage");
const { getTechCommHeights } = require("./heights/techComm");
const { getTreasuryProposalHeights } = require("./heights/treasuryProposal");

const { saveKnownHeights } = require("./mongo/service/known");

async function main() {
  const bountyHeights = await getBountyHeights();
  await saveKnownHeights(bountyHeights);
  const tipHeights = await getTipHeights();
  await saveKnownHeights(tipHeights);
  const treasuryProposalHeights = await getTreasuryProposalHeights();
  await saveKnownHeights(treasuryProposalHeights);

  const motionHeights = await getMotionHeights();
  await saveKnownHeights(motionHeights);
  const techCommHeights = await getTechCommHeights();
  await saveKnownHeights(techCommHeights);

  const externalHeights = await getExternalHeights();
  await saveKnownHeights(externalHeights);
  const publicProposalHeights = await getDemocracyPublicProposalHeights();
  await saveKnownHeights(publicProposalHeights);
  const referendumHeights = await getReferendumHeights();
  await saveKnownHeights(referendumHeights);
  const imageHeights = await getPreImageHeights();
  await saveKnownHeights(imageHeights);
}

main()
  .then(async () => {
    console.log("Known heights saved");
    await closeDataDbClient();
    await closeKnownClient();
  })
  .catch(console.error);
