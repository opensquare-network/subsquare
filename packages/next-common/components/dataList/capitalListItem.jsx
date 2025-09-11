import React from "react";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { isNil } from "lodash-es";

export default function CapitalListItem({ capital, item, tab, conviction }) {
  const chainSettings = useChainSettings();
  const chain = useChain();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;
  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);

  if (isNil(conviction)) {
    conviction = item?.conviction;
  }

  return (
    <div className="inline-flex text14Medium">
      <ValueDisplay value={capital} symbol={symbol} />
      {hasLabel && (
        <span className="w-[56px] text-textTertiary text-right">
          <VoteLabel {...item} conviction={conviction} tab={tab} />
        </span>
      )}
    </div>
  );
}
