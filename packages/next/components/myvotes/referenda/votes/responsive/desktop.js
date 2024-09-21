import { ListCard } from "../../../styled";
import DesktopActiveProposalList from "./desktopActiveProposalList";
import DesktopVotesList from "./desktopVotesList";
import OnchainVotesSubTab, {
  ActiveProposals,
  MyVoted,
  useCurrentOnchainVotesSubTab,
} from "./votesTabs";

export default function DesktopList() {
  const currentSubTab = useCurrentOnchainVotesSubTab();
  return (
    <ListCard>
      <OnchainVotesSubTab />
      {currentSubTab === MyVoted && <DesktopVotesList />}
      {currentSubTab === ActiveProposals && <DesktopActiveProposalList />}
    </ListCard>
  );
}
