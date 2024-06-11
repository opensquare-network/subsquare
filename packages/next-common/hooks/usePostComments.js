import { useChain } from "next-common/context/chain";
import { usePost } from "next-common/context/post";
import { useComments } from "next-common/context/post/comments";
import { useEffect, useState } from "react";
import { usePolkassemblyPostData } from "./polkassembly/usePolkassemblyPostData";
import dayjs from "dayjs";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { PolkassemblyChains } from "next-common/utils/polkassembly";
import { cloneDeep, filter, map, orderBy } from "lodash-es";
import { usePostCommentsFilterParams } from "./usePostCommentsFilterParams";
import { useIsDVAddressFn } from "./useIsDVAddress";
import { useGetAddressVotesDataFn } from "./useAddressVotesData";
import BigNumber from "bignumber.js";

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
        ...polkaItem.replies.map((r) => ({
          ...r,
          comment_source: "polkassembly",
        })),
      );
    } else {
      filteredPolkassemblyComments.push(polkaItem);
    }
  }

  return [
    ...(filteredPolkassemblyComments ?? []),
    ...(newSubsquareComments ?? []),
  ].sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix());
}

function isDeletedComment(comment) {
  return comment?.content?.trim?.() !== "[Deleted]";
}

export function usePostCommentsData() {
  const comments = useComments();
  const chain = useChain();
  const post = usePost();
  const polkassemblyPostData = usePolkassemblyPostData(post);
  const [filterParams] = usePostCommentsFilterParams();
  const isDVAddress = useIsDVAddressFn();
  const getAddressVotesData = useGetAddressVotesDataFn();

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

        // merge totalVotes
        data.items = map(data.items, (item) => {
          const vote = getAddressVotesData(item?.author?.address) || 0;
          item.totalVotes = BigNumber(vote.totalVotes || 0).toNumber();

          return item;
        });

        data.items = filter(data.items, (item) => {
          let flag = true;

          if (filterParams.hide_deleted) {
            if (item.replies?.length) {
              item.replies = filter(item.replies, isDeletedComment);
            }

            flag = flag && isDeletedComment(item);
          }

          if (filterParams.show_dv_only) {
            flag = flag && isDVAddress(item?.author?.address);
          }

          if (filterParams.show_voters_only) {
            flag = flag && !!getAddressVotesData(item?.author?.address);
          }

          return flag;
        });

        if (filterParams.comments_sort_by === "newest") {
          data.items = orderBy(data.items, "createdAt", "desc");
        } else if (filterParams.comments_sort_by === "oldest") {
          data.items = orderBy(data.items, "createdAt", "asc");
        } else if (filterParams.comments_sort_by === "most_votes") {
          data.items = orderBy(data.items, "totalVotes", "desc");
        } else if (filterParams.comments_sort_by === "most_thumbs_up") {
          data.items = orderBy(data.items, "reactions.length", "desc");
        }

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
    filterParams,
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
