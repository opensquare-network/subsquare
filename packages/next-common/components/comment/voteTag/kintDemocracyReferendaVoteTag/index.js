import { useComment } from "../../context";
import StandardVoteTag from "./standardVoteTag";
import { useGetAddressVotesDataFn } from "next-common/hooks/useAddressVotesData";

export default function KintDemocracyReferendaVoteTag() {
  const comment = useComment();
  const getAddressVotesData = useGetAddressVotesDataFn();

  const votesData = getAddressVotesData(comment?.author?.address);

  if (!votesData) {
    return null;
  }

  return <StandardVoteTag vote={votesData} />;
}
