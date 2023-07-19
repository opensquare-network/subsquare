import Pagination from "next-common/components/pagination";
import VoteListItem from "./voteListItem";

export default function MobileVotesList({
  data,
  isGov2,
  fetchData,
  setShowVoteDetail,
}) {
  const listContent = (data?.items || []).map((item) => (
    <VoteListItem
      key={item.referendumIndex}
      vote={item}
      isGov2={isGov2}
      setShowVoteDetail={setShowVoteDetail}
    />
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
