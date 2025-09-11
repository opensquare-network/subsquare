import { NoDelegationInfo, CommonDelegationInfoPanel } from "../delegationInfo";
import useSubDemocracyDelegating from "next-common/utils/hooks/referenda/useSubDemocracyDelegating";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ConvictionSupport } from "next-common/utils/referendumCommon";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";

export default function DemocracyDelegationInfo() {
  const { decimals, symbol } = useChainSettings();
  const realAddress = useRealAddress();
  const { delegating, isLoading } = useSubDemocracyDelegating(realAddress);

  if (isLoading) {
    return null;
  }

  if (!delegating) {
    return <NoDelegationInfo />;
  }

  const conviction = ConvictionSupport[delegating?.conviction] || 0;
  const votes = new BigNumber(delegating?.balance || 0)
    .times(conviction)
    .toString();
  const votesDisplay = toPrecision(votes || 0, decimals);

  return (
    <CommonDelegationInfoPanel>
      <span>
        You are delegating your
        <Tooltip
          content={
            <>
              <span>
                Capital:&nbsp;
                <ValueDisplay value={votesDisplay} symbol={symbol} />
              </span>
              <br />
              <span>Conviction:&nbsp;{conviction}x</span>
            </>
          }
        >
          <span className="mx-1 text-textSecondary">{votesDisplay} Votes</span>
        </Tooltip>
        to this account.
      </span>
    </CommonDelegationInfoPanel>
  );
}
