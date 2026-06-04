import { createStateContext } from "react-use";
import { useContextPapi } from "next-common/context/papi";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const [useSharedDelegatingTargetReferendumVote, Provider] =
  createStateContext(null);

function DataUpdater({ trackId, address, children }) {
  const { api, checkPallet } = useContextPapi();
  const [, setTargetVote] = useSharedDelegatingTargetReferendumVote();
  const height = useSelector(latestHeightSelector);

  useEffect(() => {
    if (!api || !address || !checkPallet("ConvictionVoting", "VotingFor")) {
      return;
    }

    api.query.ConvictionVoting.VotingFor.getValue(address, trackId).then(
      (voting) => {
        setTargetVote(voting);
      },
    );
  }, [api, address, trackId, height, setTargetVote, checkPallet]);

  return children;
}

export default function MyReferendumDelegatingTargetVoteProvider({
  trackId,
  target,
  children,
}) {
  return (
    <Provider>
      <DataUpdater trackId={trackId} address={target}>
        {children}
      </DataUpdater>
    </Provider>
  );
}

export { useSharedDelegatingTargetReferendumVote };
