import CommentItem from "./item";
import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { cn } from "next-common/utils";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import CommentsFilter from "./filter";
import CommentSkeleton from "./commentSkeleton";
import { useMemo, useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { IS_SERVER } from "next-common/utils/constants";

export default function Comments({ data: commentsData, loading }) {
  return (
    <div>
      <div className="mb-4">
        <TitleContainer className={cn("w-full !px-0")}>
          <div className="text14Bold">Comments </div>

          <CommentsFilter />
        </TitleContainer>
      </div>
      <CommentsContent loading={loading} items={commentsData?.items} />
    </div>
  );
}

const paseSize = 20;
function CommentsContent({ loading, items = [] }) {
  const [page, setPage] = useState(1);
  const [hasCommentPositioning] = useState(() => {
    if (IS_SERVER) return false;
    return window?.location?.hash?.startsWith("#");
  });

  const totalPage = useMemo(
    () => Math.ceil(items.length / paseSize),
    [items.length],
  );
  const { pageData, hasMore } = useMemo(
    () => ({
      pageData: hasCommentPositioning
        ? items
        : items?.slice(0, page * paseSize) || [],
      hasMore: hasCommentPositioning ? false : totalPage > page,
    }),
    [hasCommentPositioning, items, page, totalPage],
  );

  if (loading) {
    return (
      <>
        <CommentSkeleton />
        <CommentSkeleton />
      </>
    );
  } else if (items?.length === 0) {
    return <NoComment />;
  }

  return (
    <div>
      {pageData.map((item) =>
        item.comment_source === "polkassembly" ? (
          <PolkassemblyCommentItem key={item.id} data={item} />
        ) : (
          <CommentItem
            key={item._id}
            data={item}
            replyToCommentId={item._id}
            replyToComment={item}
          />
        ),
      )}
      {hasMore ? (
        <div className="pt-8 flex justify-center">
          <SecondaryButton
            className="text12Medium py-2 px-3"
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Load More
          </SecondaryButton>
        </div>
      ) : null}
    </div>
  );
}
