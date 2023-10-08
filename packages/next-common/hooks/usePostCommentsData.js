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
  const comments = useComments();
  const chain = useChain();
  const post = usePost();
  const polkassemblyPostData = usePolkassemblyPostData(post);

  const [commentsData, setCommentsData] = useState(comments);

  const shouldReadPolkassemblyComments =
    readPolkassemblyCommentsChains.includes(chain);

  useEffect(() => {
    if (shouldReadPolkassemblyComments) {
      if (!polkassemblyPostData.loadingComments) {
        setCommentsData((data) => {
          data.items = [
            ...polkassemblyPostData.comments.map((comment) => ({
              ...comment,
              source: "polkassembly",
            })),
            ...(data.items ?? []).map((comment) => ({
              ...comment,
              source: "subsquare",
            })),
          ].sort((a, b) => dayjs.unix(a.createdAt) - dayjs.unix(b.createdAt));

          return data;
        });
      }
    } else {
      setCommentsData(comments);
    }
  }, [shouldReadPolkassemblyComments, polkassemblyPostData.loadingComments]);

  return {
    commentsData,
    loading: polkassemblyPostData.loadingComments,
  };
}
