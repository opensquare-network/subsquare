import profileMultisig from "./multisig";
import profileDeposits from "./deposits";
import profileReferendaDelegations from "./referendaDelegations";
import profileTransfers from "./transfer";
import profileIdentityTimeline from "./identityTimeline";

export default {
  profileMultisig,
  profileReferendaDelegations,
  profileTransfers,
  profileIdentityTimeline,
  ...profileDeposits,
};
