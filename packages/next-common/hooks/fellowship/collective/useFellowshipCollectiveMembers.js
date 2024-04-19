import { usePageProps } from "next-common/context/page";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";

export default function useFellowshipCollectiveMembers() {
  // From subsquare backend server, this may delay since we scan only finalized heights
  const { fellowshipMembers } = usePageProps();
  const membersFromRedux = useSelector(fellowshipCollectiveMembersSelector); // From on-chain query, in time data

  return membersFromRedux || fellowshipMembers;
}
