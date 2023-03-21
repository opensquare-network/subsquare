import { useCallback, useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  convertPolkassemblyReaction,
  convertPolkassemblyReactionV2,
  toPolkassemblyCommentListItem,
  toPolkassemblyCommentListItemV2,
} from "utils/viewfuncs";
import { useChain } from "next-common/context/chain";
import isNil from "lodash.isnil";
import nextApi from "next-common/services/nextApi";
import { queryPostComments } from "utils/polkassembly";

const dataCache = {};

export default function usePolkassemblyPostData({ polkassemblyId, polkassemblyPostType = "discussion" }) {
  const chain = useChain();
  const isMounted = useIsMounted();
  const [comments, setComments] = useState([]);
  const [postReactions, setPostReactions] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  const loadComments = useCallback(() => {
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
    queryPostComments(polkassemblyId)
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
  }, [polkassemblyId, chain, isMounted]);

  const loadCommentsV2 = useCallback(() => {
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
    nextApi.fetch("polkassembly-comments", {
      postId: polkassemblyId,
      postType: polkassemblyPostType,
    }).then(({ result }) => {
      if (isMounted.current) {
        const comments = result?.comments?.map((item) =>
          toPolkassemblyCommentListItemV2(chain, item)
        );
        comments?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const postReactions = convertPolkassemblyReactionV2(result?.post_reactions);
        const commentsCount = result?.comments?.length;

        const data = {
          comments,
          postReactions,
          commentsCount,
        };
        dataCache[cacheKey] = data;

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

  useEffect(() => {
    if (chain === "kusama") {
      loadCommentsV2();
    } else {
      loadComments();
    }
  }, [chain, loadComments, loadCommentsV2]);

  return {
    comments,
    postReactions,
    loadingComments,
    commentsCount,
  };
}
