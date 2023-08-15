import Pagination from "next-common/components/pagination";
import FellowshipVoteListItem from "./fellowshipVoteListItem";
import EmptyList from "./emptyList";
import LoadingList from "./loadingList";

export default function MobileFellowshipVotesList({ data, fetchData, page }) {
  if (!data) {
    return <LoadingList />;
  }

  if (data.items?.length === 0) {
    return <EmptyList />;
  }

  const listContent = (data?.items || []).map((item) => (
    <FellowshipVoteListItem key={item.referendumIndex} vote={item} />
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
