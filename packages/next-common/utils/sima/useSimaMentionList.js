import { useEffect, useState } from "react";
import { getMentionNameFromAddress } from "next-common/utils/post";
import { flatten, uniq } from "lodash-es";
import { useChain } from "../../context/chain";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { tryConvertToEvmAddress } from "../mixedChainUtil";

export function getCommentProposers(comments) {
  const addresses = [
    ...(comments?.items ?? []),
    ...flatten((comments?.items ?? []).map((item) => item.replies)),
  ].map((comment) => comment.proposer);

  return uniq(addresses);
}

export default function useSimaMentionList(post, comments) {
  const chain = useChain();
  const [users, setUsers] = useState([]);
  const connectedAccount = useConnectedAccount();

  useEffect(() => {
    if (!post) {
      return;
    }

    //combine post author(s) and comment authors but exclude current user
    const proposers = [
      post.proposer,
      ...(post.authors || []),
      ...getCommentProposers(comments),
    ].filter((addr) => addr !== connectedAccount?.address);

    Promise.all(
      uniq(proposers).map(async (addr) => {
        const name = await getMentionNameFromAddress(addr, chain);
        return {
          name,
          value: tryConvertToEvmAddress(addr),
        };
      }),
    ).then((suggestions) => {
      setUsers(suggestions);
    });
  }, [chain, post, comments, connectedAccount?.address]);

  return users;
}
