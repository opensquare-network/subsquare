import LoadingList from "next-common/components/profile/votingHistory/mobile/loadingList";
import EmptyList from "next-common/components/profile/votingHistory/mobile/emptyList";

export default function ListWrapper({ isLoading, children }) {
  if (isLoading) {
    return <LoadingList />;
  }

  if (!children) {
    return <EmptyList />;
  }

  return children;
}
