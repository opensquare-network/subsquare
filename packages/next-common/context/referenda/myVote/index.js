import { createStateContext } from "react-use";
import { useContextApi } from "next-common/context/api";
import { useEffect } from "react";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import PopupOpenStateProvider from "next-common/context/popup/switch";

const [useSharedMyReferendumVote, Provider] = createStateContext(null);

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
    <PopupOpenStateProvider>
      <Provider>
        <DataUpdater trackId={trackId} address={address}>
          {children}
        </DataUpdater>
      </Provider>
    </PopupOpenStateProvider>
  );
}

export { useSharedMyReferendumVote };
