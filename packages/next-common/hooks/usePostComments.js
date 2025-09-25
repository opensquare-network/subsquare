import { useChain } from "next-common/context/chain";
import { usePost } from "next-common/context/post";
import { useComments } from "next-common/context/post/comments";
import { useEffect, useState } from "react";
import { usePolkassemblyPostData } from "./polkassembly/usePolkassemblyPostData";
import dayjs from "dayjs";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { PolkassemblyChains } from "next-common/utils/polkassembly";
import { cloneDeep } from "lodash-es";
import { usePolkassemblyCommentReply } from "./polkassembly/usePolkassemblyCommentReply";

function getShouldReadPolkassemblyComments(chain) {
  return PolkassemblyChains.includes(chain);
}

function mergeComments(
  polkassemblyComments,
  subsquareComments,
  polkassemblyCommentReplies,
) {
  const filteredPolkassemblyComments = [];
  const newSubsquareComments = cloneDeep(subsquareComments);

  for (const polkaItem of polkassemblyComments ?? []) {
    let mergedReplies = polkaItem.replies || [];
    if (polkassemblyCommentReplies?.[polkaItem.id]) {
      const replies = polkassemblyCommentReplies[polkaItem.id];
      mergedReplies = [
        ...mergedReplies,
        ...replies.map((r) => ({
          ...r,
          comment_source: "polkassembly-comment-reply",
        })),
      ];
    }
    mergedReplies.sort(
      (a, b) =>
        dayjs(a.createdAt || a.created_at).unix() -
        dayjs(b.createdAt || b.created_at).unix(),
    );

    const subsquareItem = newSubsquareComments.find(
      (item) => item._id === polkaItem.id,
    );

    if (!subsquareItem) {
      filteredPolkassemblyComments.push({
        ...polkaItem,
        replies: mergedReplies,
        comment_source: "polkassembly",
      });
      continue;
    }

    subsquareItem.replies = subsquareItem.replies || [];
    subsquareItem.replies.push(
      ...mergedReplies
        .filter((r) => r.comment_source !== "subsquare")
        .map((r) => ({
          ...r,
          comment_source:
            r.comment_source === "polkassembly-comment-reply"
              ? "polkassembly-comment-reply"
              : "polkassembly",
        })),
    );
    subsquareItem.replies.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  }

  return [
    ...(filteredPolkassemblyComments ?? []),
    ...(newSubsquareComments ?? []),
  ].sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix());
}

export function usePostCommentsData() {
  const comments = useComments();
  const chain = useChain();
  const post = usePost();
  const polkassemblyPostData = usePolkassemblyPostData(post);
  const { polkassemblyCommentReplies, isPolkassemblyCommentRepliesLoading } =
    usePolkassemblyCommentReply(post);

  const [commentsData, setCommentsData] = useState(comments);
  const shouldReadPolkassemblyComments =
    getShouldReadPolkassemblyComments(chain);

  const isLoading =
    polkassemblyPostData.loadingComments || isPolkassemblyCommentRepliesLoading;

  useEffect(() => {
    if (shouldReadPolkassemblyComments) {
      if (!isLoading) {
        const data = { ...comments };

        data.items = mergeComments(
          polkassemblyPostData.comments,
          comments.items,
          polkassemblyCommentReplies,
        );

        setCommentsData(data);
      }
    } else {
      setCommentsData(comments);
    }
  }, [
    comments,
    polkassemblyPostData.comments,
    shouldReadPolkassemblyComments,
    polkassemblyCommentReplies,
    isLoading,
  ]);

  return {
    commentsData,
    loading: isLoading,
  };
}

export function useIsUniversalPostComments() {
  const detailType = useDetailType();
  const chain = useChain();
  const shouldReadPolkassemblyComments =
    getShouldReadPolkassemblyComments(chain);

  const isUniversal =
    shouldReadPolkassemblyComments &&
    ![detailPageCategory.POST, detailPageCategory.PA_POST].includes(detailType);

  return isUniversal;
}
