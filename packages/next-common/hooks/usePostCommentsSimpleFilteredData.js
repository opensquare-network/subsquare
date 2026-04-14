import { useMemo } from "react";
import { usePostCommentsData } from "./usePostComments";
import { cloneDeep, filter } from "lodash-es";
import { useCommittedCommentFilterParams } from "next-common/components/comment/filter/utils";

function isDeletedComment(comment) {
  return comment?.content?.trim?.() !== "[Deleted]";
}

function isSpamComment(comment) {
  return !comment?.spam;
}

export function usePostCommentsSimpleFilteredData() {
  const { commentsData, loading } = usePostCommentsData();
  const [filterParams] = useCommittedCommentFilterParams();

  const filteredComments = useMemo(() => {
    const data = cloneDeep(commentsData);

    data.items = filter(data.items, (item) => {
      let flag = true;

      if (filterParams.hide_deleted) {
        if (item.replies?.length) {
          item.replies = filter(item.replies, isDeletedComment);
        }
        flag = flag && isDeletedComment(item);
      }

      if (filterParams.hide_spam) {
        if (item.replies?.length) {
          item.replies = filter(item.replies, isSpamComment);
        }
        flag = flag && isSpamComment(item);
      }

      return flag;
    });

    return data;
  }, [commentsData, filterParams.hide_deleted, filterParams.hide_spam]);

  return { commentsData: filteredComments, loading };
}
