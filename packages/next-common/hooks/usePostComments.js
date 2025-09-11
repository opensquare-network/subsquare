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

function getShouldReadPolkassemblyComments(chain) {
  return PolkassemblyChains.includes(chain);
}

function mergeComments(polkassemblyComments, subsquareComments) {
  const filteredPolkassemblyComments = [];
  const newSubsquareComments = cloneDeep(subsquareComments);
  for (const polkaItem of polkassemblyComments ?? []) {
    const subsquareItem = newSubsquareComments.find(
      (item) => item._id === polkaItem.id,
    );

    if (subsquareItem) {
      subsquareItem.replies = subsquareItem.replies || [];
      subsquareItem.replies.push(
        ...polkaItem.replies
          .filter((r) => r.comment_source !== "subsquare")
          .map((r) => ({
            ...r,
            comment_source: "polkassembly",
          })),
      );
      subsquareItem.replies.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    } else {
      filteredPolkassemblyComments.push({
        ...polkaItem,
        comment_source: "polkassembly",
      });
    }
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

  const [commentsData, setCommentsData] = useState(comments);
  const shouldReadPolkassemblyComments =
    getShouldReadPolkassemblyComments(chain);

  useEffect(() => {
    if (shouldReadPolkassemblyComments) {
      if (!polkassemblyPostData.loadingComments) {
        const data = { ...comments };

        data.items = mergeComments(
          polkassemblyPostData.comments,
          comments.items,
        );

        setCommentsData(data);
      }
    } else {
      setCommentsData(comments);
    }
  }, [
    comments,
    polkassemblyPostData.loadingComments,
    polkassemblyPostData.comments,
    shouldReadPolkassemblyComments,
  ]);

  return {
    commentsData,
    loading: polkassemblyPostData.loadingComments,
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
