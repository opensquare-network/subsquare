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
import { sumBy } from "lodash-es";
import { isNil } from "lodash-es";
import useMyIdentityDeposit from "next-common/hooks/useMyIdentityDeposit";
import useSubMyProxies from "next-common/hooks/account/useSubMyProxies";

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

  const { depositsCount } = useMyIdentityDeposit();

  const { proxies = [] } = useSubMyProxies();
  const proxyDepositsCount = proxies[0]?.length || 0;

  const count =
    sumBy(
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
    ) +
    depositsCount +
    proxyDepositsCount;

  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      Deposits
      {!isNil(count) && (
        <span className="text-textTertiary mx-1 text16Medium">
          {count || 0}
        </span>
      )}
    </Title>
  );
}
