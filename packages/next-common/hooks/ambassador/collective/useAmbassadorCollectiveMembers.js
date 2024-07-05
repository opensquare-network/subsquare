import { usePageProps } from "next-common/context/page";
import { useSelector } from "react-redux";
import { ambassadorCollectiveMembersSelector } from "next-common/store/reducers/ambassador/collective";

export default function useAmbassadorCollectiveMembers() {
  // From subsquare backend server, this may delay since we scan only finalized heights
  const { ambassadorMembers } = usePageProps();
  const membersFromRedux = useSelector(ambassadorCollectiveMembersSelector); // From on-chain query, in time data

  return membersFromRedux || ambassadorMembers;
}
