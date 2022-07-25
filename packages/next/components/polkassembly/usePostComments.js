import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  convertPolkassemblyReaction,
  toPolkassemblyCommentListItem,
} from "utils/viewfuncs";
import { queryPostComments } from "utils/polkassembly";

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

  useEffect(() => {
    if (polkassemblyId === undefined) {
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
          setComments(comments);
          setPostReactions(postReactions);
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
  };
}
