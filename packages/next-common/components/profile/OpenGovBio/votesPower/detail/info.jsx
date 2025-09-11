import { InfoAsset, InfoUserVote } from "@osn/icons/subsquare";
import Descriptions from "next-common/components/Descriptions";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useOpenGovVotesPowerContext } from "../../context/votesPower";

export function Label({ children }) {
  return (
    <span className="flex items-center gap-x-2 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:text-textTertiary">
      {children}
    </span>
  );
}

export default function OpenGovVotesPowerDetailInfo() {
  const { symbol, decimals } = useChainSettings();
  const { selfBalance, maxDelegations } = useOpenGovVotesPowerContext();

  const items = [
    {
      label: (
        <Label>
          <InfoUserVote />
          Self Balance
        </Label>
      ),
      value: (
        <ValueDisplay
          symbol={symbol}
          value={toPrecision(selfBalance, decimals)}
        />
      ),
    },
    {
      label: (
        <Label>
          <InfoAsset />
          Max Delegations
        </Label>
      ),
      value: (
        <ValueDisplay
          symbol={symbol}
          value={toPrecision(maxDelegations, decimals)}
        />
      ),
    },
  ];

  return <Descriptions items={items} />;
}
