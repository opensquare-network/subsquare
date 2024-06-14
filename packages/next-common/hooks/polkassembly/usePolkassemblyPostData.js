import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  convertPolkassemblyReaction,
  toPolkassemblyCommentListItem,
} from "next-common/utils/polkassembly";
import { useChain } from "next-common/context/chain";
import { isNil } from "lodash-es";
import nextApi from "next-common/services/nextApi";
import { uniqBy } from "lodash-es";
import QuickLRU from "quick-lru";

const dataCache = new QuickLRU({ maxSize: 100 });

export function usePolkassemblyPostData({
  polkassemblyId,
  polkassemblyPostType = "discussion",
}) {
  const chain = useChain();
  const isMounted = useIsMounted();
  const [comments, setComments] = useState([]);
  const [postReactions, setPostReactions] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (isNil(polkassemblyId) || isNil(polkassemblyPostType)) {
      return;
    }

    const cacheKey = `${polkassemblyPostType}:${polkassemblyId}`;
    if (dataCache.has(cacheKey)) {
      const data = dataCache.get(cacheKey);
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
          let comments = (result?.comments || [])
            .filter((item) => item.comment_source !== "subsquare")
            .map((item) => toPolkassemblyCommentListItem(chain, item));
          comments = uniqBy([...comments].reverse(), "id");
          comments?.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          );
          const postReactions = convertPolkassemblyReaction(
            result?.post_reactions,
            chain,
          );
          const commentsCount = result?.comments?.length;
          dataCache.set(cacheKey, {
            comments,
            postReactions,
            commentsCount,
          });

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
