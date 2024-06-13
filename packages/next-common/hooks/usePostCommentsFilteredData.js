import { useEffect, useMemo, useState } from "react";
import { usePostCommentsData } from "./usePostComments";
import { useContextApi } from "next-common/context/api";
import { cloneDeep, map, orderBy } from "lodash-es";
import BigNumber from "bignumber.js";
import { useGetAddressVotesDataFn } from "./useAddressVotesData";
import { getAddressVotingBalance } from "next-common/utils/referendumUtil";
import { filter } from "d3";
import { usePostCommentsFilterParams } from "./usePostCommentsFilterParams";
import { useIsDVAddressFn } from "./useIsDVAddress";

function isDeletedComment(comment) {
  return comment?.content?.trim?.() !== "[Deleted]";
}

function is0Balance(comment) {
  return BigNumber(comment?.balance || 0).lte(0);
}

export function usePostCommentsFilteredData() {
  const api = useContextApi();
  const { commentsData, loading } = usePostCommentsData();

  const [filterParams] = usePostCommentsFilterParams();
  const getAddressVotesData = useGetAddressVotesDataFn();
  const isDVAddress = useIsDVAddressFn();

  const [mergedComments, setMergedComments] = useState(commentsData);
  useEffect(() => {
    const data = cloneDeep(commentsData);

    merge();

    async function merge() {
      data.items = await Promise.all(
        map(data.items, async (item) => {
          item = item instanceof Promise ? await item : item;

          const address = item?.author?.address;
          const vote = getAddressVotesData(address);

          // merge total votes
          item.totalVotes = BigNumber(
            vote?.totalVotes || vote?.votes || 0,
          ).toNumber();

          // merge balance
          if (api && address) {
            item.balance = await getAddressVotingBalance(api, address);
          }

          return item;
        }),
      );

      setMergedComments(data);
    }
  }, [api, commentsData, getAddressVotesData]);

  const filteredComments = useMemo(() => {
    const data = cloneDeep(mergedComments);

    /**
     * filter comments
     */
    function sortbyNewest() {
      data.items = orderBy(data.items, "createdAt", "desc");
    }
    function sortByOldest() {
      data.items = orderBy(data.items, "createdAt", "asc");
    }
    function sortByMostVotes() {
      data.items = orderBy(data.items, "totalVotes", "desc");
    }
    function sortByMostThumbsUp() {
      data.items = orderBy(data.items, "reactions.length", "desc");
    }

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

      if (filterParams.hide_0) {
        flag = flag && !is0Balance(item);
      }

      return flag;
    });

    if (filterParams.comments_sort_by === "newest") {
      sortbyNewest();
    } else if (filterParams.comments_sort_by === "oldest") {
      sortByOldest();
    } else if (filterParams.comments_sort_by === "most_votes") {
      sortByMostVotes();
    } else if (filterParams.comments_sort_by === "most_thumbs_up") {
      sortByMostThumbsUp();
    }

    return data;
  }, [filterParams, mergedComments, getAddressVotesData]);

  return {
    commentsData: filteredComments,
    loading,
  };
}
