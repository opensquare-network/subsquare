/* eslint-disable react/jsx-key */
import { useRef, useState } from "react";
import SourceTabs, {
  Polkassembly,
  SubSquare,
} from "next-common/components/comment/sourceTabs";
import useCommentComponent from "next-common/components/useCommentComponent";
import PolkassemblyComments from "./polkassemblyComments";

export default function useUniversalComments({
  detail,
  comments,
  loginUser,
  chain,
  type,
}) {
  const paBtnRef = useRef();
  const [tabIndex, setTabIndex] = useState(SubSquare);

  let tabs = null;
  if (detail?.polkassemblyId) {
    // Allow to switch to polkassembly comments if has corresponding pa post
    tabs = (
      <div style={{ width: "240px", marginTop: "-6px" }}>
        <SourceTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
    );
  }

  let { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments,
    loginUser,
    chain,
    type,
    tabs,
  });

  if (tabIndex === Polkassembly) {
    CommentComponent = (
      <PolkassemblyComments
        tabs={tabs}
        detail={detail}
        chain={chain}
        type={type}
        btnRef={paBtnRef}
      />
    );

    focusEditor = () => {
      paBtnRef.current?.scrollIntoView();
    };
  }

  return { CommentComponent, focusEditor };
}
