import { useSelector } from "react-redux";
import {
  profileTreasuryBountyBondsSelector,
  profileTreasuryBountyCuratorDepositsSelector,
  profileTreasuryProposalDepositsSelector,
  profileTreasuryTipDepositsSelector,
} from "next-common/store/reducers/profile/deposits/treasury";
import {
  profileReferendaDecisionDepositsSelector,
  profileReferendaSubmissionDepositsSelector,
} from "next-common/store/reducers/profile/deposits/referenda";
import {
  profileFellowshipDecisionDepositsSelector,
  profileFellowshipSubmissionDepositsSelector,
} from "next-common/store/reducers/profile/deposits/fellowship";
import { profileDemocracyDepositsSelector } from "next-common/store/reducers/profile/deposits/democracy";
import { profilePreimageDepositsSelector } from "next-common/store/reducers/profile/deposits/preimage";
import { isNil } from "lodash-es";
import {
  profileIdentityDepositSelector,
  profileIdentitySubsSelector,
} from "next-common/store/reducers/profile/deposits/identity";
import { profileProxyDepositsSelector } from "next-common/store/reducers/profile/deposits/proxy";

export default function useDepositsCount() {
  const proposalDeposits = useSelector(profileTreasuryProposalDepositsSelector);
  const bountyBonds = useSelector(profileTreasuryBountyBondsSelector);
  const bountyCuratorDeposits = useSelector(
    profileTreasuryBountyCuratorDepositsSelector,
  );
  const tipDeposits = useSelector(profileTreasuryTipDepositsSelector);

  const submissionDeposits = useSelector(
    profileReferendaSubmissionDepositsSelector,
  );
  const decisionDeposits = useSelector(
    profileReferendaDecisionDepositsSelector,
  );

  const fellowshipSubmissionDeposits = useSelector(
    profileFellowshipSubmissionDepositsSelector,
  );
  const fellowshipDecisionDeposits = useSelector(
    profileFellowshipDecisionDepositsSelector,
  );

  const preimageStatuses = useSelector(profilePreimageDepositsSelector);

  const democracyDeposits = useSelector(profileDemocracyDepositsSelector);

  const identityDeposit = useSelector(profileIdentityDepositSelector);
  const identitySubs = useSelector(profileIdentitySubsSelector);

  const proxyDeposits = useSelector(profileProxyDepositsSelector);

  let depositCount = [
    proposalDeposits,
    bountyBonds,
    bountyCuratorDeposits,
    tipDeposits,
    submissionDeposits,
    decisionDeposits,
    fellowshipSubmissionDeposits,
    fellowshipDecisionDeposits,
    democracyDeposits,
    preimageStatuses,
    identitySubs,
    proxyDeposits?.items,
  ].reduce((result, deposits) => {
    if (isNil(deposits)) {
      return result;
    }

    return (result || 0) + (deposits || []).length;
  }, null);

  return identityDeposit ? depositCount + 1 : depositCount;
}
