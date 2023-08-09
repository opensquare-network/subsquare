import Pagination from "next-common/components/pagination";
import FellowshipVoteCallListItem from "./fellowshipVoteCallListItem";
import EmptyList from "./emptyList";
import LoadingList from "./loadingList";

export default function MobileFellowshipVoteCallsList({
  data,
  fetchData,
  page,
}) {
  if (!data) {
    return <LoadingList />;
  }

  if (data.items?.length === 0) {
    return <EmptyList />;
  }

  const listContent = (data?.items || []).map((item, index) => (
    <FellowshipVoteCallListItem key={index} vote={item} />
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
