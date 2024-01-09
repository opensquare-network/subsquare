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

function getLength(items) {
  return (items || []).length;
}

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

  const democracyDeposits = useSelector(profileDemocracyDepositsSelector);

  return [
    proposalDeposits,
    bountyBonds,
    bountyCuratorDeposits,
    tipDeposits,
    submissionDeposits,
    decisionDeposits,
    fellowshipSubmissionDeposits,
    fellowshipDecisionDeposits,
    democracyDeposits,
  ].reduce((result, deposit) => {
    return result + getLength(deposit);
  }, 0);
}
