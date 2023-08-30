import isNil from "lodash.isnil";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import {
  Abstain,
  Aye,
  Nay,
} from "next-common/components/profile/votingHistory/common";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import tw from "tailwind-styled-components";

const ConvictionWrapper = tw.div`flex text-textTertiary`;

const Wrapper = tw.div`flex text-[14px] grow items-center justify-between border-b-neutral300 border-b py-[12px]`;

export function VoteItem({ vote }) {
  const { symbol, decimals, voteSymbol } = useChainSettings();

  let icon = null;
  if (vote.isAbstain) {
    icon = <Abstain />;
  } else if (vote.aye) {
    icon = <Aye />;
  } else {
    icon = <Nay />;
  }

  return (
    <Wrapper>
      {icon}
      <div className="flex">
        <ValueDisplay
          className="text-textPrimary"
          value={toPrecision(vote.balance, decimals)}
          symbol={voteSymbol || symbol}
        />
        {!isNil(vote.conviction) && (
          <ConvictionWrapper>
            (
            <VoteLabel
              conviction={vote.conviction}
              isDelegating={vote.isDelegating}
            />
            )
          </ConvictionWrapper>
        )}
      </div>
    </Wrapper>
  );
}
