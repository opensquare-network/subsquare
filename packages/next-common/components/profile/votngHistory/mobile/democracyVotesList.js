import Pagination from "next-common/components/pagination";
import DemocracyVoteListItem from "./democracyVoteListItem";

export default function MobileDemocracyVotesList({ data, fetchData }) {
  const listContent = (data?.items || []).map((item) => (
    <DemocracyVoteListItem key={item.referendumIndex} vote={item} />
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
