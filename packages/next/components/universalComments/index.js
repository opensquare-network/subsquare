/* eslint-disable react/jsx-key */
import { useRef, useState } from "react";
import {
  Polkassembly,
  SubSquare,
} from "next-common/components/comment/sourceTabs";
import useComment from "components/comment";
import PolkassemblyComments from "./polkassemblyComments";

export default function useUniversalComments({
  detail,
  comments,
  loginUser,
  chain,
  type,
  page,
  pageSize,
}) {
  const paBtnRef = useRef();
  const [tabIndex, setTabIndex] = useState(SubSquare);

  let { CommentComponent, focusEditor } = useComment({
    detail,
    comments,
    loginUser,
    chain,
    type,
    tabIndex,
    setTabIndex,
  });

  if (tabIndex === Polkassembly) {
    CommentComponent = (
      <PolkassemblyComments
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        detail={detail}
        chain={chain}
        type={type}
        page={page}
        pageSize={pageSize}
        btnRef={paBtnRef}
      />
    );

    focusEditor = () => {
      paBtnRef.current?.scrollIntoView();
    };
  }

  return { CommentComponent, focusEditor };
}
