import Pagination from "next-common/components/pagination";
import OpenGovVoteListItem from "./openGovVoteListItem";

export default function MobileOpenGovVotesList({
  data,
  fetchData,
  setShowVoteDetail,
}) {
  const listContent = (data?.items || []).map((item) => (
    <OpenGovVoteListItem
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
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, data?.pageSize);
        }}
      />
    </>
  );
}
