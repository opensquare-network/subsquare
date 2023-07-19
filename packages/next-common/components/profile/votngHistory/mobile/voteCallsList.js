import Pagination from "next-common/components/pagination";
import VoteCallListItem from "./voteCallListItem";
import EmptyList from "./emptyList";
import LoadingList from "./loadingList";

export default function MobileVoteCallsList({
  data,
  isLoading,
  isGov2,
  fetchData,
}) {
  if (isLoading) {
    return <LoadingList />;
  }

  if (data.items?.length === 0) {
    return <EmptyList />;
  }

  const listContent = (data?.items || []).map((item, index) => (
    <VoteCallListItem key={index} vote={item} isGov2={isGov2} />
  ));

  return (
    <>
      <div className="flex flex-col gap-[16px]">{listContent}</div>
      <Pagination
        {...data}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, data?.pageSize);
        }}
      />
    </>
  );
}
