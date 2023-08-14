import Pagination from "next-common/components/pagination";
import VoteListItem from "./voteListItem";
import EmptyList from "./emptyList";
import LoadingList from "./loadingList";

export default function MobileVotesList({
  data,
  fetchData,
  setShowVoteDetail,
  page,
}) {
  if (!data) {
    return <LoadingList />;
  }

  if (data.items?.length === 0) {
    return <EmptyList />;
  }

  const listContent = (data?.items || []).map((item) => (
    <VoteListItem
      key={item.referendumIndex}
      vote={item}
      setShowVoteDetail={setShowVoteDetail}
    />
  ));

  return (
    <>
      <div className="flex flex-col gap-[16px]">{listContent}</div>
      <Pagination
        {...data}
        page={page}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, data?.pageSize);
        }}
      />
    </>
  );
}
