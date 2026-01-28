import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { Title } from "next-common/components/myvotes/styled";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";
import { useOnchainData } from "next-common/context/post";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { Aye, Nay } from "next-common/components/profile/votingHistory/common";
import ValueDisplay from "next-common/components/valueDisplay";
import WithAddress from "next-common/components/common/withAddress";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useSelector } from "react-redux";
import { fellowshipVotesSelector } from "next-common/store/reducers/fellowship/votes";
import { isSameAddress } from "next-common/utils";

function normalizeVote(unwrapped) {
  const isAye = unwrapped.isAye;
  const votes = unwrapped.isAye
    ? unwrapped.asAye.toNumber()
    : unwrapped.asNay.toNumber();
  return {
    isAye,
    votes,
  };
}

function useMyVote() {
  const address = useRealAddress();
  const api = useConditionalContextApi();
  const onchainData = useOnchainData();
  const referendumIndex = onchainData?.referendumIndex;
  const collectivePallet = useRankedCollectivePallet();
  const [vote, setVote] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsub;
    api.query[collectivePallet]
      .voting(referendumIndex, address, (optionalStorage) => {
        if (optionalStorage.isSome) {
          setVote(normalizeVote(optionalStorage.unwrap()));
        }
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [address, api, referendumIndex, collectivePallet]);

  return vote;
}

function VoteContentWithFinishedReferendum() {
  const address = useRealAddress();
  const { allAye = [], allNay = [] } =
    useSelector(fellowshipVotesSelector) || {};
  const myVote = [...allAye, ...allNay].find((vote) =>
    isSameAddress(vote.address, address),
  );

  return <VoteContent vote={myVote} />;
}

function VoteContent({ vote }) {
  if (!vote) {
    return null;
  }

  const { isAye, votes } = vote;
  return (
    <SecondaryCardDetail>
      <Title>My Vote</Title>
      <div className="flex text14Medium grow items-center justify-between pt-[12px]">
        {isAye ? <Aye /> : <Nay />}
        <ValueDisplay className="text-textPrimary" value={votes} />
      </div>
    </SecondaryCardDetail>
  );
}

function MyVoteWithOnchain() {
  const vote = useMyVote();

  return <VoteContent vote={vote} />;
}

export function MyVote() {
  const finishHeight = useReferendumVotingFinishHeight();
  if (finishHeight) {
    return <VoteContentWithFinishedReferendum />;
  }

  return <MyVoteWithOnchain />;
}

export default function MyCollectiveVote() {
  return (
    <WithAddress>
      <MyVote />
    </WithAddress>
  );
}
