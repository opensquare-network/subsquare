import { useChainSettings } from "next-common/context/chain";
import tw from "tailwind-styled-components";
import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { memo } from "react";

const Wrapper = tw.div`flex text14Medium grow items-center justify-between border-b-neutral300 border-b py-[12px]`;
const VoteTypeWrapper = tw.div`flex gap-[8px] items-center`;

function Label() {
  return (
    <VoteTypeWrapper>
      <ElectorateIcon />
      <span>Delegations</span>
    </VoteTypeWrapper>
  );
}

function Delegations({ delegations }) {
  const { symbol, decimals, voteSymbol } = useChainSettings();

  return (
    <Wrapper>
      <Label />
      <div className="flex">
        <ValueDisplay
          className="text-textPrimary"
          value={toPrecision(delegations, decimals)}
          symbol={voteSymbol || symbol}
        />
      </div>
    </Wrapper>
  );
}

export default memo(Delegations);
