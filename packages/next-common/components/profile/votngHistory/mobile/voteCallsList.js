import Pagination from "next-common/components/pagination";
import VoteCallListItem from "./voteCallListItem";

export default function MobileVoteCallsList({ data, isGov2, fetchData }) {
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
