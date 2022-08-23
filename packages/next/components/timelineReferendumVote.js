import VoteBar from "components/referenda/voteBar";
import useReferendumVoteData from "next-common/utils/hooks/referenda/useReferendumVoteData";
import { electorateSelector } from "next-common/store/reducers/referendumSlice";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import { useSelector } from "react-redux";

export default function TimelineReferendumVote({ referendum, chain }) {
  const api = useApi(chain);
  const { referendumStatus } = useReferendumVoteData(referendum, api);
  const electorate = useSelector(electorateSelector);

  return (
    <VoteBar
      thin={true}
      tally={referendumStatus?.tally}
      electorate={electorate}
      threshold={referendumStatus?.threshold}
    />
  );
}
