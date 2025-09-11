import { createStateContext } from "react-use";
import { useContextApi } from "next-common/context/api";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const [useSharedDelegatingTargetReferendumVote, Provider] =
  createStateContext(null);

function DataUpdater({ trackId, address, children }) {
  const api = useContextApi();
  const [, setTargetVote] = useSharedDelegatingTargetReferendumVote();
  const height = useSelector(latestHeightSelector);

  useEffect(() => {
    if (!api || !address || !api.query?.convictionVoting?.votingFor) {
      return;
    }

    api.query.convictionVoting.votingFor(address, trackId).then((voting) => {
      setTargetVote(voting);
    });
  }, [api, address, trackId, height, setTargetVote]);

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
