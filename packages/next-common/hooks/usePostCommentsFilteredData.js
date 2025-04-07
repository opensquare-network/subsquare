import { useEffect, useMemo, useState } from "react";
import { usePostCommentsData } from "./usePostComments";
import { useContextApi } from "next-common/context/api";
import { cloneDeep, every, has, map, orderBy, filter } from "lodash-es";
import BigNumber from "bignumber.js";
import { useGetAddressVotesDataFn } from "./useAddressVotesData";
import { getAddressVotingBalance } from "next-common/utils/democracy/getAddressVotingBalance";
import { useCommittedCommentFilterParams } from "next-common/components/comment/filter/utils";
import { useIsDVAddressFn } from "./useIsDVAddress";
import { defaultSortBy } from "next-common/components/comment/filter/sorter";
import { usePostCommentsMerging } from "./usePostCommentsMerging";
import { normalizeAddress } from "next-common/utils/address";
import { useChain, useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { isEthereumAddress } from "@polkadot/util-crypto";
import usePostCommentsFilterByAddressIdentity from "./usePostCommentsFilterByAddressIdentity";

function isDeletedComment(comment) {
  return comment?.content?.trim?.() !== "[Deleted]";
}

function is0Balance(comment) {
  return BigNumber(comment?.balance || 0).lte(0);
}

export function usePostCommentsFilteredData() {
  const api = useContextApi();
  const { commentsData, loading: commentsLoading } = usePostCommentsData();
  const { chainType = ChainTypes.SUBSTRATE } = useChainSettings();

  const [filterParams] = useCommittedCommentFilterParams();
  const getAddressVotesData = useGetAddressVotesDataFn();
  const isDVAddress = useIsDVAddressFn();
  const chain = useChain();

  const [, setCommentsMerging] = usePostCommentsMerging();
  const [mergedComments, setMergedComments] = useState(commentsData);

  const accountList = useMemo(() => {
    let accounts = commentsData?.items.map(({ author }) => author?.address);
    
    return Array.isArray(accounts) ? Array.from(accounts) : [];
  }, [commentsData]);

  const { identities, isCommentWithIdenticalAddress, loadingAddressIdentity } =
    usePostCommentsFilterByAddressIdentity(accountList);

  useEffect(() => {
    setCommentsMerging(
      !every(mergedComments.items, (item) => has(item, "balance")),
    );
  }, [mergedComments.items, setCommentsMerging]);

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
          if (!api) {
            return item;
          }

          if (!address) {
            item.balance = 0;
            return item;
          }

          if (
            (chainType === ChainTypes.SUBSTRATE &&
              isEthereumAddress(address)) ||
            (chainType === ChainTypes.ETHEREUM && !isEthereumAddress(address))
          ) {
            item.balance = 0;
            return item;
          }

          const normalizedAddress = normalizeAddress(address);
          try {
            item.balance = await getAddressVotingBalance(
              chain,
              api,
              normalizedAddress,
            );
          } catch (e) {
            console.error(e);
          }

          return item;
        }),
      );

      setMergedComments(data);
    }
  }, [api, chain, commentsData, getAddressVotesData, chainType]);

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

      if (filterParams.show_on_chain_identities_only) {
        flag = flag && isCommentWithIdenticalAddress(item, identities);
      }

      if (filterParams.hide_0) {
        if (has(item, "balance")) {
          flag = flag && !is0Balance(item);
        } else {
          flag = flag && true;
        }
      }

      return flag;
    });

    const sortBy = filterParams.comments_sort_by || defaultSortBy;
    if (sortBy === "newest") {
      sortbyNewest();
    } else if (sortBy === "oldest") {
      sortByOldest();
    } else if (sortBy === "most_votes") {
      sortByMostVotes();
    } else if (sortBy === "most_thumbs_up") {
      sortByMostThumbsUp();
    }

    return data;
  }, [
    mergedComments,
    filterParams.comments_sort_by,
    filterParams.hide_deleted,
    filterParams.show_dv_only,
    filterParams.show_voters_only,
    filterParams.hide_0,
    isDVAddress,
    getAddressVotesData,
    isCommentWithIdenticalAddress,
    identities,
    filterParams.show_on_chain_identities_only,
  ]);

  return {
    commentsData: filteredComments,
    loading: commentsLoading || loadingAddressIdentity,
  };
}
