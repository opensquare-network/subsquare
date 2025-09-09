import { useMemo } from "react";
import { InfoDocs } from "@osn/icons/subsquare";
import Popup from "next-common/components/popup/wrapper/Popup";
import DVDetailInfo from "next-common/components/charts/votesBubble/dv/info";
import DVDetailDelegates from "next-common/components/charts/votesBubble/dv/delegates";
import DVDetailGuardians from "next-common/components/charts/votesBubble/dv/guardians";
import BigNumber from "bignumber.js";
import { usePageProps } from "next-common/context/page";
import Descriptions from "next-common/components/Descriptions";
import InfluenceValue from "./influenceValue";
import { InfluenceLabel } from "./styled";

export default function DVDetailPopup({
  referendum,
  closeFunc,
  dvVotes,
  dvVotesValue,
  dvPercentage,
  ayeVotesValue,
  ayePercentage,
  nayVotesValue,
  nayPercentage,
  delegateReferendumVotesMap = {},
}) {
  const { cohort } = usePageProps();
  const { delegates } = cohort || {};
  const formatVotes = useMemo(
    () => mergedVotes(delegates, dvVotes),
    [delegates, dvVotes],
  );

  const delegatesVotes = useMemo(
    () => formatVotes.filter((v) => v.role !== "guardian"),
    [formatVotes],
  );

  const guardiansVotes = useMemo(
    () => formatVotes.filter((v) => v.role === "guardian"),
    [formatVotes],
  );

  const tally = referendum?.onchainData?.tally;

  const allVotesValue = BigNumber(tally.ayes).plus(tally.nays);

  return (
    <Popup title="Decentralized Voices Detail" onClose={closeFunc}>
      <div>
        <DVDetailInfo
          dvVotesValue={dvVotesValue}
          dvPercentage={dvPercentage}
          ayeVotesValue={ayeVotesValue}
          ayePercentage={ayePercentage}
          nayVotesValue={nayVotesValue}
          nayPercentage={nayPercentage}
        />
        <hr />
        <Descriptions
          items={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <InfoDocs className="w-5 h-5 text-textTertiary" />
                  <InfluenceLabel />
                </span>
              ),
              value: (
                <InfluenceValue
                  referendum={referendum}
                  referendumVotes={
                    delegateReferendumVotesMap?.[referendum.referendumIndex] ||
                    []
                  }
                />
              ),
            },
          ]}
        />
        <hr />
        <DVDetailDelegates
          votes={delegatesVotes}
          allVotesValue={allVotesValue}
        />
        <DVDetailGuardians
          votes={guardiansVotes}
          allVotesValue={allVotesValue}
        />
      </div>
    </Popup>
  );
}

function mergedVotes(delegates = [], dvVotes = []) {
  return delegates.map((delegate) => {
    const dvVote = dvVotes.find((v) => v.account === delegate.address);
    return {
      ...delegate,
      ...dvVote,
      account: delegate.address,
      role: delegate.role,
      totalVotes:
        dvVote?.votes && dvVote?.delegations
          ? BigNumber(dvVote?.votes || 0).plus(
              dvVote?.delegations?.votes["$numberDecimal"] || 0,
            )
          : null,
    };
  });
}
