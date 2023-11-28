import { useSelector } from "react-redux";
import { Title } from "./styled";
import { myPreimageDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myPreimageDeposits";
import {
  myReferendaDecisionDepositsSelector,
  myReferendaSubmissionDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myReferendaDeposits";
import {
  myFellowshipDecisionDepositsSelector,
  myFellowshipSubmissionDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myFellowshipDeposits";
import { myDemocracyDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myDemocracyDeposits";
import {
  myTreasuryBountyBondsSelector,
  myTreasuryBountyCuratorDepositsSelector,
  myTreasuryProposalDepositsSelector,
  myTreasuryTipDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";
import sumBy from "lodash.sumby";
import isNil from "lodash.isnil";

export default function DepositsTitle({ active }) {
  const referendaSubmissionDeposits = useSelector(
    myReferendaSubmissionDepositsSelector,
  );
  const referendaDecisionDeposits = useSelector(
    myReferendaDecisionDepositsSelector,
  );
  const fellowshipSubmissionDeposits = useSelector(
    myFellowshipSubmissionDepositsSelector,
  );
  const fellowshipDecisionDeposits = useSelector(
    myFellowshipDecisionDepositsSelector,
  );
  const democracyDeposits = useSelector(myDemocracyDepositsSelector);
  const treasuryProposalDeposits = useSelector(
    myTreasuryProposalDepositsSelector,
  );
  const treasuryBountyBonds = useSelector(myTreasuryBountyBondsSelector);
  const treasuryBountyCuratorDeposits = useSelector(
    myTreasuryBountyCuratorDepositsSelector,
  );
  const treasuryTipDeposits = useSelector(myTreasuryTipDepositsSelector);
  const preimageDeposits = useSelector(myPreimageDepositsSelector);

  const count = sumBy(
    [
      referendaSubmissionDeposits,
      referendaDecisionDeposits,
      fellowshipSubmissionDeposits,
      fellowshipDecisionDeposits,
      democracyDeposits,
      treasuryProposalDeposits,
      treasuryBountyBonds,
      treasuryBountyCuratorDeposits,
      treasuryTipDeposits,
      preimageDeposits,
    ],
    "length",
  );

  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      Deposits
      {!isNil(count) && count > 0 && (
        <span className="text-textTertiary mx-1">{count}</span>
      )}
    </Title>
  );
}
