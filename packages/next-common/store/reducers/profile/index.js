import profileMultisig from "./multisig";
import profileDeposits from "./deposits";
import profileReferendaDelegations from "./referendaDelegations";

export default {
  profileMultisig,
  profileReferendaDelegations,
  ...profileDeposits,
};
