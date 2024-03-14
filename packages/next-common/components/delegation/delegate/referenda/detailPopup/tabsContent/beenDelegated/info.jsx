import {
  InfoAsset,
  InfoDocs,
  InfoUserVote,
  InfoUsers,
} from "@osn/icons/subsquare";
import Descriptions from "next-common/components/Descriptions";
import Track from "next-common/components/referenda/track/trackTag";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import tw from "tailwind-styled-components";

const Label = tw.span`
inline-flex items-center gap-x-2
[&_svg]:w-5 [&_svg]:h-5 [&_svg]:text-textTertiary
`;

export default function ReferendaDelegateeDetailPopupBeenDelegatedInfo({
  delegate,
}) {
  const { symbol, decimals } = useChainSettings();

  const items = [
    {
      label: (
        <Label>
          <InfoDocs />
          Track
        </Label>
      ),
      value: <Track id={delegate?.track?.id} />,
    },
    {
      label: (
        <Label>
          <InfoUsers />
          Delegators
        </Label>
      ),
      value: delegate?.beenDelegated?.length,
    },
    {
      label: (
        <Label>
          <InfoAsset />
          Capital
        </Label>
      ),
      value: (
        <ValueDisplay
          symbol={symbol}
          value={toPrecision(delegate?.totalBalance, decimals)}
        />
      ),
    },
    {
      label: (
        <Label>
          <InfoUserVote />
          Votes
        </Label>
      ),
      value: (
        <ValueDisplay
          symbol={symbol}
          value={toPrecision(delegate?.totalVotes, decimals)}
        />
      ),
    },
  ];

  return <Descriptions items={items} />;
}
