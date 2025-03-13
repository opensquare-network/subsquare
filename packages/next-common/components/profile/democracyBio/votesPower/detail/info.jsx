import { InfoAsset, InfoUserVote, InfoUsers } from "@osn/icons/subsquare";
import Descriptions from "next-common/components/Descriptions";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useDemocracyVotesPowerContext } from "../../context/votesPower";
import { Label } from "next-common/components/profile/OpenGovBio/votesPower/detail/info";

export default function DemocracyVotesPowerDetailInfo({ delegatorCount }) {
  const { symbol, decimals } = useChainSettings();
  const { selfBalance, maxDelegations } = useDemocracyVotesPowerContext();

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
          <InfoUsers />
          Delegators
        </Label>
      ),
      value: <div>{delegatorCount}</div>,
    },
    {
      label: (
        <Label>
          <InfoAsset />
          Delegations
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
