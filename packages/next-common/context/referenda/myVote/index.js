import { createStateContext } from "react-use";
import { useContextPapi } from "next-common/context/papi";
import { useEffect } from "react";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import PopupOpenStateProvider from "next-common/context/popup/switch";

const [useSharedMyReferendumVote, Provider] = createStateContext(null);

function DataUpdater({ trackId, address, children }) {
  const { api, checkPallet } = useContextPapi();
  const [, setMyVote] = useSharedMyReferendumVote();
  const height = useSelector(latestHeightSelector);

  useEffect(() => {
    if (!api || !address || !checkPallet("ConvictionVoting", "VotingFor")) {
      return;
    }

    api.query.ConvictionVoting.VotingFor.getValue(address, trackId, {
      at: "best",
    }).then((voting) => {
      setMyVote(voting);
    });
  }, [api, address, trackId, height, setMyVote, checkPallet]);

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
