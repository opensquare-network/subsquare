import { createContext, useContext } from "react";
import CommentItem from "./item";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";

const RootCommentContext = createContext();

function SubsquareRootComment({ data }) {
  return (
    <RootCommentContext.Provider value={{ data }}>
      <CommentItem data={data} />
    </RootCommentContext.Provider>
  );
}

function PolkassemblyRootComment({ data }) {
  return (
    <RootCommentContext.Provider value={{ data }}>
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
