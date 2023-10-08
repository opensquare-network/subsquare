import { useChain } from "next-common/context/chain";
import { usePost } from "next-common/context/post";
import { useComments } from "next-common/context/post/comments";
import Chains from "next-common/utils/consts/chains";
import { useEffect, useState } from "react";
import { usePolkassemblyPostData } from "./polkassembly/usePolkassemblyPostData";
import dayjs from "dayjs";

const readPolkassemblyCommentsChains = [
  Chains.kusama,
  Chains.polkadot,
  Chains.moonriver,
  Chains.collectives,
];

export function usePostCommentsData() {
  const [commentsData, setCommentsData] = useState([]);

  const chain = useChain();
  const post = usePost();
  const comments = useComments();
  const polkassemblyPostData = usePolkassemblyPostData(post);

  const shouldReadPolkassemblyComments =
    readPolkassemblyCommentsChains.includes(chain);

  useEffect(() => {
    if (shouldReadPolkassemblyComments) {
      if (!polkassemblyPostData.loadingComments) {
        setCommentsData(
          [
            ...polkassemblyPostData.comments.map((comment) => ({
              ...comment,
              source: "polkassembly",
            })),
            ...(comments.items ?? []).map((comment) => ({
              ...comment,
              source: "subsquare",
            })),
          ].sort((a, b) => dayjs.unix(a.createdAt) - dayjs.unix(b.createdAt)),
        );
      }
    } else {
      setCommentsData(comments);
    }
  }, [shouldReadPolkassemblyComments, polkassemblyPostData.loadingComments]);

  return {
    comments: commentsData,
    loading: polkassemblyPostData.loadingComments,
    multiSource: shouldReadPolkassemblyComments,
  };
}
