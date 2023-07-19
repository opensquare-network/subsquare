import Pagination from "next-common/components/pagination";
import DemocracyVoteCallListItem from "./democracyVoteCallListItem";

export default function MobileDemocracyVoteCallsList({ data, fetchData }) {
  const listContent = (data?.items || []).map((item, index) => (
    <DemocracyVoteCallListItem key={index} vote={item} />
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
