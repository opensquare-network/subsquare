import { useState } from "react";
import { SystemMenu } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import DecentralizedVoicesDetail from "./decentralizedVoicesDetail";
import { useVoicesValue } from "next-common/hooks/referenda/useDecentralizedVoicesValue";
import { bnToPercentage } from "next-common/utils/bn";
import BigNumber from "bignumber.js";

export default function ActionButton({ referendum, referendumVotes }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { dvVotesValue, ayeVotesValue, nayVotesValue } = useVoicesValue(
    referendumVotes.map((v) => ({
      ...v,
      totalVotes:
        v.votes && v.delegations
          ? BigNumber(v.votes).plus(v.delegations?.votes["$numberDecimal"] || 0)
          : null,
    })) || [],
  );

  if (!referendum) {
    return null;
  }

  const tally = referendum?.onchainData?.tally;

  const allVotesValue = BigNumber(tally?.ayes || 0).plus(tally?.nays || 0);

  const dvPercentage = bnToPercentage(dvVotesValue, allVotesValue);
  const ayePercentage = bnToPercentage(ayeVotesValue, allVotesValue);
  const nayPercentage = bnToPercentage(nayVotesValue, allVotesValue);

  return (
    <>
      <SecondaryButton
        size="small"
        variant="secondary"
        className="p-0 w-7 h-7"
        onClick={() => setDetailOpen(true)}
      >
        <SystemMenu className="w-4 h-4" />
      </SecondaryButton>
      {detailOpen && (
        <DecentralizedVoicesDetail
          closeFunc={() => setDetailOpen(false)}
          referendum={referendum}
          dvVotes={referendumVotes}
          dvVotesValue={dvVotesValue}
          dvPercentage={dvPercentage}
          ayeVotesValue={ayeVotesValue}
          ayePercentage={ayePercentage}
          nayVotesValue={nayVotesValue}
          nayPercentage={nayPercentage}
        />
      )}
    </>
  );
}
