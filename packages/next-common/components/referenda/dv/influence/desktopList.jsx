import DataList from "next-common/components/dataList";
import { useMemo, useState } from "react";
import { SystemMenu, SystemYes, SystemNo } from "@osn/icons/subsquare";
import Track from "../../track/trackTag";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import Link from "next/link";
import SecondaryButton from "next-common/lib/button/secondary";
import PostVotesSummary from "next-common/components/postList/common/votesSummary";
import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import DVDetailPopup from "./voteDetailModal";
import { useVoicesValue } from "next-common/hooks/referenda/useDecentralizedVoicesValue";

const columns = [
  {
    name: "Referendum",
    style: { textAlign: "left" },
  },
  {
    name: "Track",
    style: { width: 160, extAlign: "left" },
  },
  {
    name: "",
    style: { width: 24 },
  },
  {
    name: "Status",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "Influence",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "",
    style: { width: 80, textAlign: "right" },
  },
];

export default function InfluenceDesktopList({
  referendumData,
  delegateReferendumVotesMap,
}) {
  const { symbol, decimals } = useChainSettings();
  const rows = useMemo(() => {
    if (!referendumData) {
      return [];
    }

    return referendumData.map((referendum) => [
      <Link
        href={`/referenda/${referendum.referendumIndex}`}
        key="title"
        className="text-ellipsis"
      >
        {getGov2ReferendumTitle(referendum)}
      </Link>,
      <Track key="track" id={referendum.track} />,
      <PostVotesSummary
        tally={referendum.onchainData?.tally}
        decimals={decimals}
        symbol={symbol}
        key="votesSummary"
      />,
      <StateTag key="state" referendum={referendum} />,
      <Influence
        referendum={referendum}
        referendumVotes={
          delegateReferendumVotesMap[referendum.referendumIndex] || []
        }
        key="influence"
      />,
      <ActionButton
        referendum={referendum}
        referendumVotes={
          delegateReferendumVotesMap[referendum.referendumIndex] || []
        }
        key="action"
      />,
    ]);
  }, [referendumData, delegateReferendumVotesMap, decimals, symbol]);

  return (
    <>
      <DataList title="Influence" columns={columns} rows={rows} />
    </>
  );
}

export function StateTag({ referendum }) {
  const stateArgs = useMemo(() => {
    return getGov2ReferendumStateArgs(referendum?.onchainData?.state);
  }, [referendum?.onchainData?.state]);

  if (!referendum) {
    return null;
  }

  return <Gov2ReferendaTag state={referendum.state.name} args={stateArgs} />;
}

export function ActionButton({ referendum, referendumVotes }) {
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
  console.log(
    "referendumVotes in ActionButton",
    referendumVotes,
    referendumVotes.map((v) => ({
      ...v,
      totalVotes:
        v.votes && v.delegations
          ? BigNumber(v.votes).plus(v.delegations?.votes["$numberDecimal"] || 0)
          : null,
    })) || [],
    dvVotesValue,
    ayeVotesValue,
    nayVotesValue,
  );

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
        <DVDetailPopup
          closeFunc={() => setDetailOpen(false)}
          referendum={referendum}
          dvVotes={referendumVotes}
          dvVotesValue={dvVotesValue}
          dvPercentage={0}
          ayeVotesValue={ayeVotesValue}
          ayePercentage={0}
          nayVotesValue={nayVotesValue}
          nayPercentage={0}
        />
      )}
    </>
  );
}

export function Influence({ referendum, referendumVotes = [] }) {
  const tally = referendum?.onchainData?.tally;

  if (!tally) {
    return null;
  }

  const allAye = BigNumber(tally.ayes);
  const allNay = BigNumber(tally.nays);

  if (!allAye || !allNay) {
    return null;
  }

  const totalImpact = referendumVotes.reduce(
    (sum, v) => {
      const impact = calculateImpact(v);
      return {
        aye: sum.aye.plus(impact.aye),
        nay: sum.nay.plus(impact.nay),
      };
    },
    { aye: BigNumber(0), nay: BigNumber(0) },
  );

  const a = allAye.plus(totalImpact.aye || 0);
  const n = allNay.minus(totalImpact.nay || 0);

  const icon = allAye.gt(a) ? <SystemYes /> : <SystemNo />;

  return <div className="flex justify-end">{icon}</div>;
}

function calculateImpact(vote) {
  let aye = BigNumber(0);
  let nay = BigNumber(0);

  if (vote.isStandard) {
    if (vote.aye) {
      aye = aye.plus(vote.balance);
    } else {
      nay = nay.plus(vote.balance);
    }
  }

  return {
    aye,
    nay,
  };
}
