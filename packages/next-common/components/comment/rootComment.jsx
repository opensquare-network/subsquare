import { createContext, useCallback, useContext } from "react";
import CommentItem from "./item";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import { useCommentActions } from "next-common/sima/context/commentActions";
import { useComments, useSetComments } from "next-common/context/post/comments";
import { useRouter } from "next/router";
import { usePolkassemblyCommentRepliesContext } from "next-common/hooks/polkassembly/usePolkassemblyCommentReply";

const RootCommentContext = createContext();

export function SubsquareRootComment({ data }) {
  const router = useRouter();
  const { getComment } = useCommentActions();
  const comments = useComments();
  const setComments = useSetComments();

  const reloadRootComment = useCallback(async () => {
    const { result: updatedComment } = await getComment(data);
    if (updatedComment) {
      const newComments = {
        ...comments,
        items: comments.items.map((item) => {
          if (item._id === updatedComment._id) {
            return updatedComment;
          }
          return item;
        }),
      };
      setComments(newComments);

      const scrollPosition = window.scrollY;
      await router.replace(router.asPath);
      window.scrollTo(0, scrollPosition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments, setComments, data._id]);

  return (
    <RootCommentContext.Provider value={{ data, reloadRootComment }}>
      <CommentItem data={data} />
    </RootCommentContext.Provider>
  );
}

export function PolkassemblyRootComment({ data }) {
  const { refetchPolkassemblyCommentReplies } =
    usePolkassemblyCommentRepliesContext();

  return (
    <RootCommentContext.Provider
      value={{ data, reloadRootComment: refetchPolkassemblyCommentReplies }}
    >
      <PolkassemblyCommentItem data={data} />
    </RootCommentContext.Provider>
  );
}

export function RootCommentItem({ data }) {
  if (data.comment_source === "polkassembly") {
    return <PolkassemblyRootComment data={data} />;
  }

  return <SubsquareRootComment data={data} />;
}

export function useRootCommentData() {
  const { data } = useContext(RootCommentContext) || {};
  return data;
}

export function useRootCommentContext() {
  return useContext(RootCommentContext);
}
