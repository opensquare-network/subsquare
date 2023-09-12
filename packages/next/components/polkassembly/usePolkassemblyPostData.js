import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  convertPolkassemblyReaction,
  toPolkassemblyCommentListItem,
} from "utils/viewfuncs";
import { useChain } from "next-common/context/chain";
import isNil from "lodash.isnil";
import nextApi from "next-common/services/nextApi";

const dataCache = {};

export default function usePolkassemblyPostData({
  polkassemblyId,
  polkassemblyPostType = "discussion",
}) {
  const chain = useChain();
  const isMounted = useIsMounted();
  const [comments, setComments] = useState([]);
  const [postReactions, setPostReactions] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (isNil(polkassemblyId) || isNil(polkassemblyPostType)) {
      return;
    }

    const cacheKey = `${polkassemblyPostType}:${polkassemblyId}`;
    if (dataCache[cacheKey]) {
      const data = dataCache[cacheKey];
      setComments(data.comments);
      setPostReactions(data.postReactions);
      setCommentsCount(data.commentsCount);
      return;
    }

    setLoadingComments(true);
    nextApi
      .fetch("polkassembly-comments", {
        postId: polkassemblyId,
        postType: polkassemblyPostType,
      })
      .then(({ result }) => {
        if (isMounted.current) {
          const comments = result?.comments
            ?.filter((item) => item.comment_source !== "subsquare")
            ?.map((item) => toPolkassemblyCommentListItem(chain, item));
          comments?.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          );
          const postReactions = convertPolkassemblyReaction(
            result?.post_reactions,
          );
          const commentsCount = result?.comments?.length;
          dataCache[cacheKey] = {
            comments,
            postReactions,
            commentsCount,
          };

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
  }, [polkassemblyId, polkassemblyPostType, chain, isMounted]);

  return {
    comments,
    postReactions,
    loadingComments,
    commentsCount,
  };
}
