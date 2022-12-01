/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import SourceTabs, {
  Polkassembly,
  SubSquare,
} from "next-common/components/comment/sourceTabs";
import useCommentComponent from "next-common/components/useCommentComponent";
import PolkassemblyComments from "./polkassemblyComments";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import isNil from "lodash.isnil";
import useCommentsAnchor from "next-common/utils/hooks/useCommentsAnchor";

export default function useUniversalComments({ detail, comments, type }) {
  const chain = useChain();
  const { commentsCount, polkassemblyCommentsCount } = detail;
  let defaultTabIndex = SubSquare;
  if (commentsCount > 0 || polkassemblyCommentsCount <= 0) {
    defaultTabIndex = SubSquare;
  } else if (
    !isNil(detail?.polkassemblyId) &&
    detail?.dataSource === "polkassembly"
  ) {
    defaultTabIndex = Polkassembly;
  }
  const { hasAnchor } = useCommentsAnchor();

  const paBtnRef = useRef();
  const [tabIndex, setTabIndex] = useState(defaultTabIndex);
  const { width } = useWindowSize();

  useEffect(() => {
    if (hasAnchor) {
      setTabIndex(SubSquare);
    }
  }, [hasAnchor]);

  const isDotsama = [Chains.kusama, Chains.polkadot].includes(chain);

  let tabs = null;

  if (detail?.polkassemblyId !== undefined && isDotsama) {
    // Allow to switch to polkassembly comments if has corresponding pa post
    if (parseInt(width) <= 768) {
      tabs = (
        <div style={{ width: "100%" }}>
          <SourceTabs
            small={false}
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
          />
        </div>
      );
    } else if (isDotsama) {
      tabs = (
          <SourceTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
        <div style={{ marginTop: "-6px" }}>
        </div>
      );
    }
  }

  let { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments,
    type,
    tabs,
  });

  if (tabIndex === Polkassembly) {
    CommentComponent = (
      <PolkassemblyComments
        tabs={tabs}
        detail={detail}
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
