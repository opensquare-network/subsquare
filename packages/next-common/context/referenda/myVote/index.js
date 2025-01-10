import { createStateContext } from "react-use";
import { useContextApi } from "next-common/context/api";
import { useEffect } from "react";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";

const [useSharedMyReferendumVote, Provider] = createStateContext(null);
const [useSharedRemovePopupOpen, RemovePopupOpenProvider] =
  createStateContext(false);

function DataUpdater({ trackId, address, children }) {
  const api = useContextApi();
  const [, setMyVote] = useSharedMyReferendumVote();
  const height = useSelector(latestHeightSelector);

  useEffect(() => {
    if (!api || !address || !api.query?.convictionVoting?.votingFor) {
      return;
    }

    api.query.convictionVoting.votingFor(address, trackId).then((voting) => {
      setMyVote(voting);
    });
  }, [api, address, trackId, height, setMyVote]);

  return children;
}

export default function MyReferendumVoteProvider({
  trackId,
  address,
  children,
}) {
  return (
    <RemovePopupOpenProvider>
      <Provider>
        <DataUpdater trackId={trackId} address={address}>
          {children}
        </DataUpdater>
      </Provider>
    </RemovePopupOpenProvider>
  );
}

export { useSharedMyReferendumVote, useSharedRemovePopupOpen };
