import Pagination from "next-common/components/pagination";
import OpenGovVoteCallListItem from "./openGovVoteCallListItem";

export default function MobileOpenGovVoteCallsList({ data, fetchData }) {
  const listContent = (data?.items || []).map((item, index) => (
    <OpenGovVoteCallListItem key={index} vote={item} />
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
