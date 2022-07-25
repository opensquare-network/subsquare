import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  convertPolkassemblyReaction,
  toPolkassemblyCommentListItem,
} from "utils/viewfuncs";
import { queryPostComments } from "utils/polkassembly";

const dataCache = {};

export default function usePostComments({
  polkassemblyId,
  chain,
  page,
  pageSize,
}) {
  const isMounted = useIsMounted();
  const [comments, setComments] = useState([]);
  const [postReactions, setPostReactions] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (polkassemblyId === undefined) {
      return;
    }

    if (dataCache[polkassemblyId]) {
      const data = dataCache[polkassemblyId];
      setComments(data.comments);
      setPostReactions(data.postReactions);
      setCommentsCount(data.commentsCount);
      return;
    }

    setLoadingComments(true);
    queryPostComments(polkassemblyId, page, pageSize)
      .then((result) => {
        if (isMounted.current) {
          const comments = result?.comments?.map((item) =>
            toPolkassemblyCommentListItem(chain, item)
          );
          const postReactions = result?.post_reactions?.map((item) =>
            convertPolkassemblyReaction(chain, item)
          );
          const commentsCount = result?.comments_aggregate?.aggregate?.count;

          const data = {
            comments,
            postReactions,
            commentsCount,
          };
          dataCache[polkassemblyId] = data;

          setComments(comments);
          setPostReactions(postReactions);
          setCommentsCount(commentsCount);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoadingComments(false);
        }
      });
  }, [polkassemblyId, chain, page, pageSize, isMounted]);

  return {
    comments,
    postReactions,
    loadingComments,
    commentsCount,
  };
}
