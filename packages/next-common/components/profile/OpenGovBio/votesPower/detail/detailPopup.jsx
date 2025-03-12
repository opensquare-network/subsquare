import Popup from "next-common/components/popup/wrapper/Popup";
import { VotesPowerPanelWrapper, VotesPowerValueDisplay } from "../index";
import { InfoAsset, InfoUserVote } from "@osn/icons/subsquare";
import Descriptions from "next-common/components/Descriptions";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import tw from "tailwind-styled-components";
import { useOpenGovVotesPowerContext } from "../../context/votesPower";
import Divider from "next-common/components/styled/layout/divider";

const Label = tw.span`
inline-flex items-center gap-x-2
[&_svg]:w-5 [&_svg]:h-5 [&_svg]:text-textTertiary
`;

function OpenGovVotesPowerDetailInfo() {
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

function OpenGovVotesPowerDetailHeader() {
  return (
    <VotesPowerPanelWrapper>
      <VotesPowerValueDisplay />
    </VotesPowerPanelWrapper>
  );
}

export default function OpenGovVotesPowerDetailPopup({ setDetailOpen }) {
  return (
    <Popup
      title="Votes Power Detail"
      className="w-[640px] max-w-full"
      onClose={() => {
        setDetailOpen(false);
      }}
    >
      <OpenGovVotesPowerDetailHeader />
      <OpenGovVotesPowerDetailInfo />
      <Divider className="!my-0" />
      {/* TODO: table list */}
    </Popup>
  );
}
